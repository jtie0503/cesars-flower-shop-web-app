export function useOrder() {

       const orderItem = ref<TOrder>({
    name: "",
    email: "",
    phone: "",
    address: "",
    items: [],
    totalAmount: 0,
    note: "",
    deliveryDate: "",
    status: "",
});
    function getAll({ page = 1, limit = 10, status = "" } = {}) {
        return $fetch<{ items: TOrder[], pages: number, pageRange: string }>("/api/v1/orders", {
            method: "GET",
            query: { page, limit, status },
        });
    }

    function getById(id: string) {
       return $fetch<TOrder>(`/api/v1/orders/${id}`);
    }
    
    function add(data: TOrder) {
        return $fetch("/api/v1/orders", {
            method: "POST",
            body: data,
        });
    }

    function updateById(id: string, data: Partial<TOrder>) {
        return $fetch(`/api/v1/orders/${id}`, {
            method: "PATCH",
            body: data,
        });
    }

    function deleteById(id: string){
        return $fetch(`/api/v1/orders/${id}`, {
            method: "DELETE",
        });
    }

    return{
        orderItem   ,
        getAll,
        getById,
        add,
        updateById,
        deleteById,
    }

}