import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productionOrderService } from '../services/productionOrder.service';
import type { ProductionOrderFormValues } from '../types/production-order.types';

export function useProductionOrders() {
  return useQuery({
    queryKey: ['production-orders'],
    queryFn: () => productionOrderService.getProductionOrders(),
  });
}

export function useProductionOrder(id: string | null) {
  return useQuery({
    queryKey: ['production-orders', id],
    queryFn: () => (id ? productionOrderService.getProductionOrder(id) : null),
    enabled: !!id,
  });
}

export function useCreateProductionOrder() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: ProductionOrderFormValues) => productionOrderService.createProductionOrder(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['production-orders'] });
    },
  });
}

export function useUpdateProductionOrder() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ProductionOrderFormValues> }) => 
      productionOrderService.updateProductionOrder(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['production-orders'] });
      queryClient.invalidateQueries({ queryKey: ['production-orders', variables.id] });
    },
  });
}

export function useDeleteProductionOrder() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => productionOrderService.deleteProductionOrder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['production-orders'] });
    },
  });
}
