<template>
  <v-card>
    <v-layout>
      <v-navigation-drawer
        class="bg-deep-purple"
        theme="dark"
        permanent
      >
        <v-list color="transparent">
          <v-list-item title="🌸 Cesar's Flower Shop"
          subtitle="Admin Panel"   
          ></v-list-item>
          <v-list-item prepend-icon="mdi-flower" title="PRODUCTS"  @click="activeTab = 'products'"></v-list-item>
          <v-list-item prepend-icon="mdi-clipboard-list" title="ORDERS"  @click="activeTab = 'orders'"></v-list-item>
          <v-list-item prepend-icon="mdi-truck" title="DELIVERY FEES" @click="activeTab = 'delivery'"></v-list-item>
        </v-list>

        <template v-slot:append>
          <div class="pa-2">
            <v-btn block  @click="handleLogout">
              Logout
            </v-btn>
          </div>
        </template>
      </v-navigation-drawer>
      <v-main style="min-height: 100vh" >


        <!--Product Section-->
        <v-row v-if ="activeTab === 'products'" no-gutters class="pa-4">
          <v-col cols="12" class="mb-3">
            <v-row no-gutters align="center">
              <v-btn
                class="text-none mr-2"
                rounded="pill"
                variant="tonal"
                size="large"
                @click="handleDialogAdd()"
              >
                Add Product
              </v-btn>
            </v-row>          
          </v-col>

          <v-col cols="12">
            <v-card
              width="100%"
              variant="outlined"
              border="thin"
              rounded="lg"
              :loading="loading"
            >
              <v-toolbar density="compact" color="grey-lighten-4">
                <template #prepend>
                  <v-btn>
                    <v-icon>mdi-refresh</v-icon>
                  </v-btn>
                </template>

               

                <template #append>
                  <span class="mr-2 text-caption">{{ pageRange }}</span>
                  <v-btn icon density="comfortable" :disabled="page === 1" @click="prevPage()">
                      <v-icon>mdi-chevron-left</v-icon>
                  </v-btn>
                  <v-btn icon density="comfortable" :disabled="page === pages" @click="nextPage()">
                      <v-icon>mdi-chevron-right</v-icon>
                  </v-btn>
              </template>
              </v-toolbar>

              <v-data-table
                :headers="headers"
                :items="items"
                item-value="_id"
                items-per-page="10"
                hide-default-footer
                style="max-height: calc(100vh - 200px)"
                @click:row="(_: any, { item }: { item: TProduct }) => handleRowClick(item)"
              >
              </v-data-table>
            </v-card>
          </v-col>
        </v-row>
         
        <!--ADD DIALOG / PRODUCTS-->
        <v-dialog v-model="dialogAdd" max-width="500" persistent>
          <productsForm
            title="Add Product"
            mode="add"
            v-model:form="form"
            @submit:add="submitAdd()"
            @cancel="dialogAdd = false"
          />
        </v-dialog>

        <!--VIEW DIALOG / PRODUCTS-->
        <v-dialog v-model="dialogView" max-width="500" persistent>
          <productsForm
            title="Product Details"
            mode="view"
            v-model:form="selectedItem"
            @edit="handleEdit()"
            @delete="handleDelete()"
            @close="dialogView = false"
          />
        </v-dialog>
        
         <!--EDIT DIALOG / PRODUCTS-->
        <v-dialog v-model="dialogEdit" max-width="500" persistent>
          <productsForm
            title="Edit Product"
            mode="edit"
            v-model:form="selectedItem"
            @submit:update="submitEdit()"
            @cancel="dialogEdit = false"
          />
        </v-dialog>

        <!--DELETE DIALOG / PRODUCTS-->
        <v-dialog v-model="dialogDelete" max-width="400" persistent>
          <v-card>
            <v-card-title class="text-h6">Confirm Deletion</v-card-title>
            <v-card-text>Are you sure you want to delete this product?</v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn variant="text" @click="dialogDelete = false">Cancel</v-btn>
              <v-btn variant="flat" color="red" @click="submitDelete()">Delete</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>


        <!--Orders-->
        <v-row v-if ="activeTab === 'orders'" no-gutters class="pa-4">
           <v-col cols="12">
            <v-card
              width="100%"
              variant="outlined"
              border="thin"
              rounded="lg"
              :loading="orderLoading"
            >
              <v-toolbar density="compact" color="grey-lighten-4">
                <template #prepend>
                  <v-btn>
                    <v-icon>mdi-refresh</v-icon>
                  </v-btn>
                </template>

               

                <template #append>
                  <span class="mr-2 text-caption">{{ orderPageRange }}</span>
                  <v-btn icon density="comfortable" :disabled="orderPage === 1" @click="prevOrderPage()">
                      <v-icon>mdi-chevron-left</v-icon>
                  </v-btn>
                  <v-btn icon density="comfortable" :disabled="orderPage === orderPages" @click="nextOrderPage()">
                      <v-icon>mdi-chevron-right</v-icon>
                  </v-btn>
              </template>
              </v-toolbar>

              <v-data-table
                :headers="orderHeaders"
                :items="orderItems"
                item-value="_id"
                items-per-page="10"
                hide-default-footer
                style="max-height: calc(100vh - 200px)"
               @click:row="(_: any, { item }: { item: TOrder }) => handleOrderRowClick(item)"
              >
              </v-data-table>
            </v-card>
          </v-col>
        </v-row>

        <v-dialog v-model="orderDialogView" max-width="500" persistent>
           <ordersForm
              title="Order Details"
              mode="view"
              v-model:form="selectedOrder"
              @close="orderDialogView = false"
              @submit:update="orderDialogConfirm = true"
            />
        </v-dialog>

        <!-- CONFIRM STATUS DIALOG -->
        <v-dialog v-model="orderDialogConfirm" max-width="400" persistent>
          <v-card>
            <v-card-title class="text-h6">Update Status</v-card-title>
            <v-card-text>Are you sure you want to update this order status to <strong>{{ selectedOrder.status }}</strong>?</v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn variant="text" @click="orderDialogConfirm = false">Cancel</v-btn>
              <v-btn variant="flat" color="black" @click="submitOrderUpdateStatus()">Confirm</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>


                  <!--Delivery Fees-->

        <v-row v-if ="activeTab === 'delivery'" no-gutters class="pa-4">
          <v-col cols="12" class="mb-3">
            <v-row no-gutters align="center">
              <v-btn
                class="text-none mr-2"
                rounded="pill"
                variant="tonal"
                size="large"
                @click="handleDeliveryDialogAdd()"
              >
                Delivery Location Add
              </v-btn>
            </v-row>          
          </v-col>

          <v-col cols="12">
            <v-card
              width="100%"
              variant="outlined"
              border="thin"
              rounded="lg"
              :loading="loading"
            >
              <v-toolbar density="compact" color="grey-lighten-4">
                <template #prepend>
                  <v-btn>
                    <v-icon>mdi-refresh</v-icon>
                  </v-btn>
                </template>

               

                <template #append>
                  <span class="mr-2 text-caption">{{ deliveryPageRange }}</span>
                  <v-btn icon density="comfortable" :disabled="page === 1" @click="prevDeliveryPage()">
                      <v-icon>mdi-chevron-left</v-icon>
                  </v-btn>
                  <v-btn icon density="comfortable" :disabled="page === pages" @click="nextDeliveryPage()">
                      <v-icon>mdi-chevron-right</v-icon>
                  </v-btn>
              </template>
              </v-toolbar>

              <v-data-table
                :headers="deliveryHeaders"
                :items="deliveryItems"
                item-value="_id"
                items-per-page="10"
                hide-default-footer
                style="max-height: calc(100vh - 200px)"
                @click:row="(_: any, { item }: { item: TDelivery }) => handleDeliveryRowClick(item)"
              >
              </v-data-table>
            </v-card>
          </v-col>
        </v-row>
         
        <!--ADD DIALOG / Delivery-->
        <v-dialog v-model="dialogDeliveryAdd" max-width="500" persistent>
          <delivery-form
            title="Add Delivery Location"
            mode="add"
            v-model:form="deliveryFormData"
            @submit:add="submitDeliveryAdd()"
            @cancel="dialogDeliveryAdd = false"
          />
        </v-dialog>

        <!--VIEW DIALOG / PRODUCTS-->
        <v-dialog v-model="deliveryDialogView" max-width="500" persistent>
          <delivery-form
            title="Product Details"
            mode="view"
           v-model:form="selectedDelivery" 
            @edit="handleDeliveryEdit()"
            @delete="handleDeliveryDelete()"
            @close="dialogView = false"
          />
        </v-dialog>
        
         <!--EDIT DIALOG / PRODUCTS-->
        <v-dialog v-model="dialogDeliveryEdit" max-width="500" persistent>
          <delivery-form
            title="Edit Product"
            mode="edit"
           v-model:form="selectedDelivery" 
            @submit:update="submitDeliveryEdit()"
            @cancel="dialogEdit = false"
          />
        </v-dialog>

        <!--DELETE DIALOG / PRODUCTS-->
        <v-dialog v-model="dialogDeliveryDelete" max-width="400" persistent>
          <v-card>
            <v-card-title class="text-h6">Confirm Deletion</v-card-title>
            <v-card-text>Are you sure you want to delete this Location?</v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn variant="text" @click="dialogDelete = false">Cancel</v-btn>
              <v-btn variant="flat" color="red" @click="submitDeliveryDelete()">Delete</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>



      </v-main>
    </v-layout>
  </v-card>
</template>

<script setup lang="ts">

definePageMeta({
    middleware: "auth",
});

//PRODUCTS
const activeTab = ref("products");
const dialogAdd = ref(false);
const dialogView = ref(false);
const dialogEdit = ref(false);
const dialogDelete = ref(false);
const items = ref<TProduct[]>([]);
const selectedItem = ref<TProduct>({} as TProduct);
  const orderDialogConfirm = ref(false);

const headers = [
  { title: "ID", key: "_id" },
  { title: "Name", key: "name" },
  { title: "Price", key: "price" },
  { title: "Category", key: "category" },
  { title: "Status", key: "status" },
];

const pageRange = ref("-- - -- of --");
const page = ref(1);
const pages = ref(1);


const { productItem, getAll, add, updateById, deleteById } = useProduct();
const form = ref<TProduct>({ ...productItem.value });

const { data, refresh, status } = await useLazyAsyncData(
  "get-product-items",
  () => getAll({ page: page.value }),{ watch: [page] }
);

const loading = computed(() => status.value === "pending");


watchEffect(() => {
  if (data.value) {
    items.value = data.value.items;
    pageRange.value = data.value.pageRange;
    pages.value = data.value.pages;
  }
});

function nextPage() {
  if (page.value < pages.value) {
    page.value += 1;
  }
}

function prevPage() {
  if (page.value > 1) {
    page.value -= 1;
  }
}

function handleDialogAdd() {
 form.value = { name: "", price: 0, description: "", imageUrl: "", category: "", status: "" };
  dialogAdd.value = true;
}


async function submitAdd() {
 try {
   await add(form.value);
   dialogAdd.value = false;
   await refresh();
 } catch (error) {
    console.error("Error adding product:", error);
 }
}

function handleRowClick(item: TProduct) {
  selectedItem.value = { ...item };
  dialogView.value = true;
}

function handleEdit() {
  dialogView.value = false;
  dialogEdit.value = true;
}

async function submitEdit() {
  try {
    await updateById(selectedItem.value._id!, {
      
      name: selectedItem.value.name,
      description: selectedItem.value.description,
      price: Number(selectedItem.value.price),
      imageUrl: selectedItem.value.imageUrl,
      category: selectedItem.value.category,
      status: selectedItem.value.status,
    }
    );
    dialogEdit.value = false;
    await refresh();
  } catch (error) {
    console.error("Error :", error);
  }
}

function handleDelete() {
  dialogView.value = false;
  dialogDelete.value = true;
}

async function submitDelete() {
  try {
    await deleteById(selectedItem.value._id!);
    dialogDelete.value = false;
    await refresh();
  } catch (error) {
    console.error("Error deleting product:", error);
  }
}

//ORDERS

const orderItems = ref<TOrder[]>([]);
const selectedOrder = ref<TOrder>({} as TOrder);
const orderDialogView = ref(false);
const orderPageRange = ref("-- - -- of --");
const orderPage = ref(1);
const orderPages = ref(1);


const orderHeaders = [
  { title: "Name", key: "name" },
  { title: "Email", key: "email" },
  { title: "Total Amount", key: "totalAmount" },
  { title: "Status", key: "status" },
  { title: "Delivery Date", key: "deliveryDate" },
];

const { orderItem, getAll: getAllOrders, updateById: updateOrderById } = useOrder();

const {  data: orderData, refresh: refreshOrders, status: orderStatus } = await useLazyAsyncData(
  "get-orders",
  () => getAllOrders({ page: orderPage.value }),{ watch: [orderPage] }

);

const orderLoading = computed(() => orderStatus.value === "pending");

watchEffect(() => {
  if (orderData.value) {
    orderItems.value = orderData.value.items;
    orderPageRange.value = orderData.value.pageRange;
    orderPages.value = orderData.value.pages;
  }
});

function nextOrderPage() {
  if (orderPage.value < orderPages.value) {
    orderPage.value += 1;
  }
}

function prevOrderPage() {
  if (orderPage.value > 1) {
    orderPage.value -= 1;
  }
} 
function handleOrderRowClick(item: TOrder) {
  selectedOrder.value = { ...item };
  orderDialogView.value = true;
}

async function submitOrderUpdateStatus() {
  try {
    await updateOrderById(selectedOrder.value._id!, { status: selectedOrder.value.status });
    orderDialogView.value = false;
    orderDialogConfirm.value = false;
    await refreshOrders();
  } catch (error) {
    console.error("Error:", error);
  }
}

async function handleLogout() {
    await $fetch("/api/v1/auth/logout", { method: "DELETE" });
    const token = useCookie("adminToken");
    token.value = null;
    await navigateTo("/login");
}


//Delivery
const deliveryItems = ref<TDelivery[]>([]);
const selectedDelivery= ref<TDelivery>({} as TDelivery);
const deliveryDialogView = ref(false);
const deliveryPageRange = ref("-- - -- of --");
const deliveryPage = ref(1);
const deliveryPages = ref(1);
 const deliveryDialogConfirm = ref(false);
 const dialogDeliveryAdd = ref(false);
const dialogDeliveryEdit = ref(false);
const dialogDeliveryDelete = ref(false);

const deliveryHeaders = [
  { title: "Location Name", key: "locationName" },
  { title: "Motorcycle Fee", key: "motorcycleFee" },
  { title: "Sedan Fee", key: "sedanFee" },

];

const deliveryFormData = ref<TDelivery>({ locationName: "", motorcycleFee: 0, sedanFee: 0 });
const { add: addDelivery, deleteById: deleteDeliveryById, getAll: getAllDelivery, updateById: updateDeliveryById } = useDelivery();


const {  data: deliveryData, refresh: refreshDelivery,  } = await useLazyAsyncData(
  "get-delivery-locations",
  () => getAllDelivery({ page: deliveryPage.value }),{ watch: [deliveryPage] }

);

watchEffect(() => {
  if (deliveryData.value) {
    deliveryItems.value = deliveryData.value.items;
    deliveryPageRange.value = deliveryData.value.pageRange;
    deliveryPages.value = deliveryData.value.pages;
  }
});

function nextDeliveryPage() {
  if (deliveryPage.value < deliveryPage.value) {
    deliveryPage.value += 1;
  }
}

function prevDeliveryPage() {
  if (deliveryPage.value > 1) {
    deliveryPage.value -= 1;
  }
} 
function handleDeliveryRowClick(item: TDelivery) {
  selectedDelivery.value = { ...item };
  deliveryDialogView.value = true;
}

function handleDeliveryDialogAdd() {
  deliveryFormData.value = { locationName: "", motorcycleFee: 0, sedanFee: 0 };
  dialogDeliveryAdd.value = true;
}

async function submitDeliveryAdd() {
  try {
    await addDelivery(deliveryFormData.value);
    dialogDeliveryAdd.value = false; 
    await refreshDelivery();
  } catch (error) { console.error("Error:", error); }
}

function handleDeliveryEdit() {
  deliveryDialogView.value = false;
   dialogDeliveryEdit.value = true;
}

async function submitDeliveryEdit() {
  try {
    await updateDeliveryById(selectedDelivery.value._id!, {
      locationName: selectedDelivery.value.locationName,
      motorcycleFee: selectedDelivery.value.motorcycleFee,
      sedanFee: selectedDelivery.value.sedanFee,
    });
    dialogDeliveryEdit.value = false
    await refreshDelivery();
  } catch (error) { console.error("Error:", error); }
}

function handleDeliveryDelete() {
  deliveryDialogView.value = false;  
  dialogDeliveryDelete.value = true;
}

async function submitDeliveryDelete() {
  try {
    await deleteDeliveryById(selectedDelivery.value._id!);
   dialogDeliveryDelete.value = false;
    await refreshDelivery();
  } catch (error) { console.error("Error:", error); }
}

</script>