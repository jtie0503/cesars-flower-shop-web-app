export function useProduct() {

          const productItem = ref<TProduct>({
        name: "",
        price: 0,
        description: "",
        imageUrl: "",
        category: "",
        status: "",
    });
    function getAll({ page = 1, limit = 10, category = "" } = {}) {
        return $fetch<{ items: TProduct[], pages: number, pageRange: string }>("/api/v1/products", {
            method: "GET",
            query: { page, limit, category },
        });
    }

    function getById(id: string) {
       return $fetch<TProduct>(`/api/v1/products/${id}`);
    }
    
    function add(data: TProduct) {
        return $fetch("/api/v1/products", {
            method: "POST",
            body: data,
        });
    }

    function updateById(id: string, data: Partial<TProduct>) {
        return $fetch(`/api/v1/products/${id}`, {
            method: "PATCH",
            body: data,
        });
    }

    function deleteById(id: string){
        return $fetch(`/api/v1/products/${id}`, {
            method: "DELETE",
        });
    }

    return{
        productItem,
        getAll,
        getById,
        add,
        updateById,
        deleteById,
    }

}