export function useDelivery(){

    const deliveryItem = ref<TDelivery>({
        locationName: "",
        motorcycleFee: 0,
        sedanFee: 0,
    });

     function getAll({ page = 1, limit = 10, } = {}) {
        return $fetch<{ items: TDelivery[], pages: number, pageRange: string }>("/api/v1/delivery", {
            method: "GET",
            query: { page, limit },
        });
    }

    function getById(id: string) {
       return $fetch<TDelivery>(`/api/v1/delivery/${id}`);
    }
    
    function add(data: TDelivery) {
        return $fetch("/api/v1/delivery", {
            method: "POST",
            body: data,
        });
    }

    function updateById(id: string, data: Partial<TDelivery>) {
        return $fetch(`/api/v1/delivery/${id}`, {
            method: "PATCH",
            body: data,
        });
    }

    function deleteById(id: string){
        return $fetch(`/api/v1/delivery/${id}`, {
            method: "DELETE",
        });
    }

    return{
        deliveryItem,
        getAll,
        getById,
        add,
        updateById,
        deleteById,
    }
}