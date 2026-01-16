import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { 
  Package, 
  CheckCircle, 
  XCircle, 
  Search,
  ExternalLink,
  Edit,
  Trash2,
  RefreshCw
} from 'lucide-react';

interface SourcedProduct {
  id: string;
  product_name: string;
  original_source_url: string;
  cost_price: number;
  suggested_retail_price: number;
  description: string;
  tags: string[];
  sourcing_confidence: number | null;
  supplier_rating: number | null;
  supplier_name: string | null;
  category: string | null;
  status: string | null;
  stock_status: string | null;
  gross_margin: number | null;
  lovable_margin_percent: number | null;
  in_stock: boolean | null;
  approved_for_listing: boolean | null;
  notes: string | null;
  created_at: string;
  scraped_at: string | null;
}

export const SourcedInventoryDashboard = () => {
  const [products, setProducts] = useState<SourcedProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<SourcedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [marginFilter, setMarginFilter] = useState('all');
  const [editingProduct, setEditingProduct] = useState<SourcedProduct | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    approved: 0,
    pending: 0,
    avgMargin: 0,
    highConfidence: 0
  });

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('sourced_products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setProducts(data || []);
      calculateStats(data || []);
    } catch (error: any) {
      toast.error('Failed to load inventory');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (data: SourcedProduct[]) => {
    const approved = data.filter(p => p.approved_for_listing).length;
    const pending = data.filter(p => p.status === 'pending').length;
    const margins = data.filter(p => p.lovable_margin_percent).map(p => p.lovable_margin_percent!);
    const avgMargin = margins.length ? margins.reduce((a, b) => a + b, 0) / margins.length : 0;
    const highConfidence = data.filter(p => (p.sourcing_confidence || 0) >= 80).length;

    setStats({
      total: data.length,
      approved,
      pending,
      avgMargin: Math.round(avgMargin * 100) / 100,
      highConfidence
    });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    let filtered = [...products];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(p => 
        p.product_name.toLowerCase().includes(term) ||
        p.description?.toLowerCase().includes(term) ||
        p.tags?.some(t => t.toLowerCase().includes(term))
      );
    }

    if (statusFilter !== 'all') {
      if (statusFilter === 'approved') {
        filtered = filtered.filter(p => p.approved_for_listing);
      } else if (statusFilter === 'pending') {
        filtered = filtered.filter(p => p.status === 'pending');
      } else if (statusFilter === 'rejected') {
        filtered = filtered.filter(p => p.status === 'rejected');
      }
    }

    if (marginFilter !== 'all') {
      if (marginFilter === 'high') {
        filtered = filtered.filter(p => (p.lovable_margin_percent || 0) >= 70);
      } else if (marginFilter === 'medium') {
        filtered = filtered.filter(p => (p.lovable_margin_percent || 0) >= 50 && (p.lovable_margin_percent || 0) < 70);
      } else if (marginFilter === 'low') {
        filtered = filtered.filter(p => (p.lovable_margin_percent || 0) < 50);
      }
    }

    setFilteredProducts(filtered);
  }, [products, searchTerm, statusFilter, marginFilter]);

  const handleApprove = async (id: string) => {
    try {
      const { error } = await supabase
        .from('sourced_products')
        .update({ approved_for_listing: true, status: 'approved' })
        .eq('id', id);

      if (error) throw error;
      toast.success('Approved for listing');
      fetchProducts();
    } catch (error: any) {
      toast.error('Failed to approve');
    }
  };

  const handleReject = async (id: string) => {
    try {
      const { error } = await supabase
        .from('sourced_products')
        .update({ approved_for_listing: false, status: 'rejected' })
        .eq('id', id);

      if (error) throw error;
      toast.success('Rejected');
      fetchProducts();
    } catch (error: any) {
      toast.error('Failed to reject');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product?')) return;
    
    try {
      const { error } = await supabase
        .from('sourced_products')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Deleted');
      fetchProducts();
    } catch (error: any) {
      toast.error('Failed to delete');
    }
  };

  const handleUpdateProduct = async (product: SourcedProduct) => {
    try {
      const { error } = await supabase
        .from('sourced_products')
        .update({
          product_name: product.product_name,
          description: product.description,
          cost_price: product.cost_price,
          suggested_retail_price: product.suggested_retail_price,
          notes: product.notes,
          category: product.category
        })
        .eq('id', product.id);

      if (error) throw error;
      toast.success('Updated');
      setEditingProduct(null);
      fetchProducts();
    } catch (error: any) {
      toast.error('Failed to update');
    }
  };

  const getMarginClass = (margin: number | null) => {
    if (!margin) return "badge-confidence";
    if (margin >= 70) return "badge-margin-high";
    if (margin >= 50) return "badge-margin-medium";
    return "badge-margin-low";
  };

  return (
    <div className="min-h-screen surface-0 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <header className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-2xl font-medium text-dominant tracking-tight">
              Sourced Inventory
            </h1>
            <p className="text-subordinate text-sm mt-1">
              {stats.total} products · {stats.approved} approved · {stats.avgMargin}% avg margin
            </p>
          </div>
          <Button 
            onClick={fetchProducts} 
            variant="ghost" 
            className="text-subordinate hover:text-dominant"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </header>

        {/* Filters: Quiet, functional */}
        <div className="flex flex-wrap gap-4 items-center mb-8 pb-6 border-b border-border">
          <div className="flex-1 min-w-[200px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-whisper" />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-calm pl-10"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[130px] surface-2 border-0 text-sm">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>

          <Select value={marginFilter} onValueChange={setMarginFilter}>
            <SelectTrigger className="w-[130px] surface-2 border-0 text-sm">
              <SelectValue placeholder="Margin" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Margins</SelectItem>
              <SelectItem value="high">High (70%+)</SelectItem>
              <SelectItem value="medium">Medium (50-70%)</SelectItem>
              <SelectItem value="low">Low (&lt;50%)</SelectItem>
            </SelectContent>
          </Select>

          <span className="text-xs text-tertiary">
            {filteredProducts.length} shown
          </span>
        </div>

        {/* Products List */}
        {loading ? (
          <div className="flex justify-center py-16">
            <RefreshCw className="h-5 w-5 animate-spin text-tertiary" />
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="empty-state">
            <Package className="empty-state-icon" />
            <p className="empty-state-message">
              No products in inventory.
            </p>
            <p className="empty-state-suggestion">
              Run the sourcing pipeline to discover products.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredProducts.map((product) => (
              <article 
                key={product.id} 
                className="product-card flex items-start gap-6"
              >
                {/* Primary Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-3 mb-2">
                    <h3 className="text-base font-medium text-dominant leading-snug truncate">
                      {product.product_name}
                    </h3>
                    {product.approved_for_listing && (
                      <CheckCircle className="h-4 w-4 text-margin-high shrink-0 mt-0.5" />
                    )}
                  </div>
                  
                  <p className="text-sm text-subordinate line-clamp-1 mb-3">
                    {product.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {product.category && (
                      <span className="badge-category">{product.category}</span>
                    )}
                    {product.tags?.slice(0, 3).map((tag, i) => (
                      <span 
                        key={i} 
                        className="px-2 py-0.5 text-xs rounded surface-2 text-tertiary"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Metrics: Dominant margin */}
                <div className="flex items-center gap-6 shrink-0">
                  <div className="text-right">
                    <p className="text-xs text-whisper">Cost</p>
                    <p className="text-sm text-dominant">${product.cost_price}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-whisper">Retail</p>
                    <p className="text-sm text-margin-high">${product.suggested_retail_price}</p>
                  </div>
                  <div className="text-right min-w-[60px]">
                    <p className="text-xs text-whisper">Margin</p>
                    <span className={getMarginClass(product.lovable_margin_percent)}>
                      {product.lovable_margin_percent?.toFixed(0) || '—'}%
                    </span>
                  </div>
                  <div className="text-right min-w-[60px]">
                    <p className="text-xs text-whisper">Confidence</p>
                    <span className="badge-confidence">
                      {product.sourcing_confidence || '—'}%
                    </span>
                  </div>
                </div>

                {/* Actions: Quiet, deliberate */}
                <div className="flex items-center gap-1 shrink-0">
                  {!product.approved_for_listing && product.status !== 'rejected' && (
                    <>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => handleApprove(product.id)}
                        className="text-margin-high hover:bg-margin-high/10"
                      >
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => handleReject(product.id)}
                        className="text-margin-low hover:bg-margin-low/10"
                      >
                        <XCircle className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => setEditingProduct(product)}
                        className="text-tertiary hover:text-subordinate"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="surface-1 border-border">
                      <DialogHeader>
                        <DialogTitle className="text-dominant">Edit Product</DialogTitle>
                      </DialogHeader>
                      {editingProduct && (
                        <div className="space-y-4 pt-2">
                          <div>
                            <label className="text-xs text-tertiary block mb-1.5">Product Name</label>
                            <Input
                              value={editingProduct.product_name}
                              onChange={(e) => setEditingProduct({...editingProduct, product_name: e.target.value})}
                              className="input-calm"
                            />
                          </div>
                          <div>
                            <label className="text-xs text-tertiary block mb-1.5">Description</label>
                            <Textarea
                              value={editingProduct.description || ''}
                              onChange={(e) => setEditingProduct({...editingProduct, description: e.target.value})}
                              className="input-calm min-h-[80px]"
                              rows={3}
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-xs text-tertiary block mb-1.5">Cost Price</label>
                              <Input
                                type="number"
                                value={editingProduct.cost_price}
                                onChange={(e) => setEditingProduct({...editingProduct, cost_price: parseFloat(e.target.value)})}
                                className="input-calm"
                              />
                            </div>
                            <div>
                              <label className="text-xs text-tertiary block mb-1.5">Retail Price</label>
                              <Input
                                type="number"
                                value={editingProduct.suggested_retail_price}
                                onChange={(e) => setEditingProduct({...editingProduct, suggested_retail_price: parseFloat(e.target.value)})}
                                className="input-calm"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="text-xs text-tertiary block mb-1.5">Notes</label>
                            <Textarea
                              value={editingProduct.notes || ''}
                              onChange={(e) => setEditingProduct({...editingProduct, notes: e.target.value})}
                              className="input-calm"
                              rows={2}
                            />
                          </div>
                          <Button 
                            onClick={() => handleUpdateProduct(editingProduct)}
                            className="w-full btn-primary"
                          >
                            Save Changes
                          </Button>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>

                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => handleDelete(product.id)}
                    className="text-tertiary hover:text-margin-low"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>

                  {product.original_source_url && (
                    <a 
                      href={product.original_source_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-2 text-tertiary hover:text-subordinate transition-colors"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
