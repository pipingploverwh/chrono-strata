import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { 
  Package, 
  TrendingUp, 
  DollarSign, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Search,
  ExternalLink,
  Edit,
  Trash2,
  Filter,
  RefreshCw,
  Sparkles,
  BarChart3
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
      toast.error('Failed to fetch products: ' + error.message);
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
      toast.success('Product approved for listing!');
      fetchProducts();
    } catch (error: any) {
      toast.error('Failed to approve: ' + error.message);
    }
  };

  const handleReject = async (id: string) => {
    try {
      const { error } = await supabase
        .from('sourced_products')
        .update({ approved_for_listing: false, status: 'rejected' })
        .eq('id', id);

      if (error) throw error;
      toast.success('Product rejected');
      fetchProducts();
    } catch (error: any) {
      toast.error('Failed to reject: ' + error.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
      const { error } = await supabase
        .from('sourced_products')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Product deleted');
      fetchProducts();
    } catch (error: any) {
      toast.error('Failed to delete: ' + error.message);
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
      toast.success('Product updated!');
      setEditingProduct(null);
      fetchProducts();
    } catch (error: any) {
      toast.error('Failed to update: ' + error.message);
    }
  };

  const getConfidenceBadge = (confidence: number | null) => {
    if (!confidence) return <Badge variant="outline">Unknown</Badge>;
    if (confidence >= 80) return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">{confidence}%</Badge>;
    if (confidence >= 60) return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">{confidence}%</Badge>;
    return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">{confidence}%</Badge>;
  };

  const getMarginBadge = (margin: number | null) => {
    if (!margin) return null;
    if (margin >= 70) return <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">{margin.toFixed(1)}%</Badge>;
    if (margin >= 50) return <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">{margin.toFixed(1)}%</Badge>;
    return <Badge className="bg-rose-500/20 text-rose-400 border-rose-500/30">{margin.toFixed(1)}%</Badge>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Sparkles className="h-8 w-8 text-purple-400" />
              Lavender Sourcing Dashboard
            </h1>
            <p className="text-gray-400 mt-1">Manage AI-sourced products for Lovable Shopping</p>
          </div>
          <Button onClick={fetchProducts} variant="outline" className="gap-2">
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Package className="h-8 w-8 text-purple-400" />
                <div>
                  <p className="text-2xl font-bold text-white">{stats.total}</p>
                  <p className="text-xs text-gray-400">Total Products</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-8 w-8 text-green-400" />
                <div>
                  <p className="text-2xl font-bold text-white">{stats.approved}</p>
                  <p className="text-xs text-gray-400">Approved</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Clock className="h-8 w-8 text-yellow-400" />
                <div>
                  <p className="text-2xl font-bold text-white">{stats.pending}</p>
                  <p className="text-xs text-gray-400">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-8 w-8 text-emerald-400" />
                <div>
                  <p className="text-2xl font-bold text-white">{stats.avgMargin}%</p>
                  <p className="text-xs text-gray-400">Avg Margin</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <BarChart3 className="h-8 w-8 text-blue-400" />
                <div>
                  <p className="text-2xl font-bold text-white">{stats.highConfidence}</p>
                  <p className="text-xs text-gray-400">High Confidence</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search products, tags..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-gray-900/50 border-gray-600"
                  />
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-400" />
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[140px] bg-gray-900/50 border-gray-600">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Select value={marginFilter} onValueChange={setMarginFilter}>
                <SelectTrigger className="w-[140px] bg-gray-900/50 border-gray-600">
                  <SelectValue placeholder="Margin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Margins</SelectItem>
                  <SelectItem value="high">High (70%+)</SelectItem>
                  <SelectItem value="medium">Medium (50-70%)</SelectItem>
                  <SelectItem value="low">Low (&lt;50%)</SelectItem>
                </SelectContent>
              </Select>

              <Badge variant="secondary" className="text-sm">
                {filteredProducts.length} products
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Products Grid */}
        <Tabs defaultValue="grid" className="w-full">
          <TabsList className="bg-gray-800/50">
            <TabsTrigger value="grid">Grid View</TabsTrigger>
            <TabsTrigger value="table">Table View</TabsTrigger>
          </TabsList>

          <TabsContent value="grid" className="mt-4">
            {loading ? (
              <div className="flex justify-center py-12">
                <RefreshCw className="h-8 w-8 animate-spin text-purple-400" />
              </div>
            ) : filteredProducts.length === 0 ? (
              <Card className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-12 text-center">
                  <Package className="h-12 w-12 mx-auto text-gray-500 mb-4" />
                  <p className="text-gray-400">No products found. Start sourcing at /lavender-agent</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProducts.map((product) => (
                  <Card key={product.id} className="bg-gray-800/50 border-gray-700 hover:border-purple-500/50 transition-colors">
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-lg text-white line-clamp-2">
                          {product.product_name}
                        </CardTitle>
                        {product.approved_for_listing && (
                          <CheckCircle className="h-5 w-5 text-green-400 shrink-0" />
                        )}
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {product.tags?.slice(0, 3).map((tag, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {product.category && (
                          <Badge className="bg-purple-500/20 text-purple-400 text-xs">
                            {product.category}
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-gray-400 line-clamp-2">{product.description}</p>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-gray-900/50 p-2 rounded">
                          <p className="text-xs text-gray-500">Cost</p>
                          <p className="text-lg font-semibold text-white">${product.cost_price}</p>
                        </div>
                        <div className="bg-gray-900/50 p-2 rounded">
                          <p className="text-xs text-gray-500">Retail</p>
                          <p className="text-lg font-semibold text-emerald-400">${product.suggested_retail_price}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">Margin:</span>
                          {getMarginBadge(product.lovable_margin_percent)}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">Confidence:</span>
                          {getConfidenceBadge(product.sourcing_confidence)}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-2 border-t border-gray-700">
                        {!product.approved_for_listing && product.status !== 'rejected' && (
                          <Button 
                            size="sm" 
                            onClick={() => handleApprove(product.id)}
                            className="flex-1 bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                        )}
                        {!product.approved_for_listing && product.status !== 'rejected' && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleReject(product.id)}
                            className="flex-1 border-red-600 text-red-400 hover:bg-red-600/20"
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        )}
                        
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => setEditingProduct(product)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-gray-800 border-gray-700">
                            <DialogHeader>
                              <DialogTitle>Edit Product</DialogTitle>
                            </DialogHeader>
                            {editingProduct && (
                              <div className="space-y-4">
                                <div>
                                  <label className="text-sm text-gray-400">Product Name</label>
                                  <Input
                                    value={editingProduct.product_name}
                                    onChange={(e) => setEditingProduct({...editingProduct, product_name: e.target.value})}
                                    className="bg-gray-900 border-gray-600"
                                  />
                                </div>
                                <div>
                                  <label className="text-sm text-gray-400">Description</label>
                                  <Textarea
                                    value={editingProduct.description || ''}
                                    onChange={(e) => setEditingProduct({...editingProduct, description: e.target.value})}
                                    className="bg-gray-900 border-gray-600"
                                    rows={3}
                                  />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="text-sm text-gray-400">Cost Price</label>
                                    <Input
                                      type="number"
                                      value={editingProduct.cost_price}
                                      onChange={(e) => setEditingProduct({...editingProduct, cost_price: parseFloat(e.target.value)})}
                                      className="bg-gray-900 border-gray-600"
                                    />
                                  </div>
                                  <div>
                                    <label className="text-sm text-gray-400">Retail Price</label>
                                    <Input
                                      type="number"
                                      value={editingProduct.suggested_retail_price}
                                      onChange={(e) => setEditingProduct({...editingProduct, suggested_retail_price: parseFloat(e.target.value)})}
                                      className="bg-gray-900 border-gray-600"
                                    />
                                  </div>
                                </div>
                                <div>
                                  <label className="text-sm text-gray-400">Notes</label>
                                  <Textarea
                                    value={editingProduct.notes || ''}
                                    onChange={(e) => setEditingProduct({...editingProduct, notes: e.target.value})}
                                    className="bg-gray-900 border-gray-600"
                                    rows={2}
                                  />
                                </div>
                                <Button 
                                  onClick={() => handleUpdateProduct(editingProduct)}
                                  className="w-full bg-purple-600 hover:bg-purple-700"
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
                          className="text-red-400 hover:bg-red-600/20"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>

                        {product.original_source_url && (
                          <a 
                            href={product.original_source_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-white"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="table" className="mt-4">
            <Card className="bg-gray-800/50 border-gray-700">
              <ScrollArea className="h-[600px]">
                <table className="w-full">
                  <thead className="sticky top-0 bg-gray-800">
                    <tr className="border-b border-gray-700">
                      <th className="text-left p-4 text-gray-400 font-medium">Product</th>
                      <th className="text-right p-4 text-gray-400 font-medium">Cost</th>
                      <th className="text-right p-4 text-gray-400 font-medium">Retail</th>
                      <th className="text-right p-4 text-gray-400 font-medium">Margin</th>
                      <th className="text-center p-4 text-gray-400 font-medium">Confidence</th>
                      <th className="text-center p-4 text-gray-400 font-medium">Status</th>
                      <th className="text-right p-4 text-gray-400 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((product) => (
                      <tr key={product.id} className="border-b border-gray-700/50 hover:bg-gray-700/30">
                        <td className="p-4">
                          <div>
                            <p className="text-white font-medium">{product.product_name}</p>
                            <p className="text-xs text-gray-500 line-clamp-1">{product.description}</p>
                          </div>
                        </td>
                        <td className="p-4 text-right text-white">${product.cost_price}</td>
                        <td className="p-4 text-right text-emerald-400">${product.suggested_retail_price}</td>
                        <td className="p-4 text-right">{getMarginBadge(product.lovable_margin_percent)}</td>
                        <td className="p-4 text-center">{getConfidenceBadge(product.sourcing_confidence)}</td>
                        <td className="p-4 text-center">
                          {product.approved_for_listing ? (
                            <Badge className="bg-green-500/20 text-green-400">Listed</Badge>
                          ) : product.status === 'rejected' ? (
                            <Badge className="bg-red-500/20 text-red-400">Rejected</Badge>
                          ) : (
                            <Badge className="bg-yellow-500/20 text-yellow-400">Pending</Badge>
                          )}
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            {!product.approved_for_listing && product.status !== 'rejected' && (
                              <Button size="sm" variant="ghost" onClick={() => handleApprove(product.id)}>
                                <CheckCircle className="h-4 w-4 text-green-400" />
                              </Button>
                            )}
                            <Button size="sm" variant="ghost" onClick={() => handleDelete(product.id)}>
                              <Trash2 className="h-4 w-4 text-red-400" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </ScrollArea>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
