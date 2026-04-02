<template>
    <v-card width="100%">
        <v-toolbar>
            <v-row no-gutters class="fill-height px-6" align="center">
                <span class="font-weight-bold text-h5">{{ title }}</span>
            </v-row>
        </v-toolbar>
        

        <v-card-text style="max-height:70vh;overflow: auto">
            <v-row v-if="mode === 'view'" no-gutters>

                <v-col cols="12" class="text-subtitle-1 font-weight-bold mb-2">
                    Order Form
                </v-col>

                <v-col cols="12" class="mb-2">
                    <strong>Name:</strong>{{ formModel.name }}
                </v-col>

                <v-col cols="6" class="mb-2">
                    <strong>Email:</strong>{{ formModel.email }}
                </v-col>

                <v-col cols="6" class="mb-2">
                    <strong>Phone:</strong>{{ formModel.phone }}
                </v-col>

                <v-col cols="6" class="mb-2">
                    <strong>Address:</strong> {{ formModel.address }}
                </v-col>
                <v-col cols="6" class="mb-2">
                    <strong>Total Amount:</strong> ₱{{ formModel.totalAmount }}
                </v-col>
                <v-col cols="6" class="mb-2">
                    <strong>Delivery Date:</strong> {{ formModel.deliveryDate }}
                </v-col>
                <v-col cols="6" class="mb-2">
                    <strong>Location:</strong> {{ formModel.location }}
                </v-col>
                <v-col cols="6" class="mb-2">
                    <strong>Delivery Fee:</strong> ₱{{ formModel.deliveryFee }}
                </v-col>
                <v-col cols="12" class="mb-2">
                    <strong>Note:</strong> {{ formModel.note }}
                </v-col>

                <!-- Items List -->
                <v-col cols="12" class="mb-2 mt-2">
                    <strong>Items Ordered:</strong>
                    <v-card
                        v-for="item in formModel.items"
                        :key="item.productId"
                        class="mt-2 pa-2"
                        variant="outlined"
                        rounded="lg"
                    >
                        <div class="d-flex justify-space-between">
                            <span class="text-body-2 font-weight-bold">{{ item.name }}</span>
                            <span class="text-body-2">x{{ item.quantity }}</span>
                        </div>
                        <div class="d-flex justify-space-between">
                            <span class="text-caption text-grey">₱{{ item.price }} each</span>
                            <span class="text-caption font-weight-bold">₱{{ item.price * item.quantity }}</span>
                        </div>
                        <div v-if="item.note" class="mt-1">
                            <span class="text-caption text-grey-darken-1 font-italic">📝 {{ item.note }}</span>
                        </div>
                        <div v-if="item.wrapper" class="mt-1">
                            <span class="text-caption text-grey-darken-1">🎨 Wrapper: {{ item.wrapper }}</span>
                        </div>
                        <div v-if="item.ribbon" class="mt-1">
                            <span class="text-caption text-grey-darken-1">🎀 Ribbon: {{ item.ribbon }}</span>
                        </div>
                    </v-card>
                </v-col>
                <!-- Current Status chip -->
                <v-col cols="6" class="mb-2">
                    <strong>Current Status:</strong>
                    <v-chip 
                        :color="formModel.status === 'pending' ? 'orange' : formModel.status === 'confirmed' ? 'blue' : 'green'"
                        size="small"
                        class="ml-1"
                    >
                        {{ formModel.status || 'pending' }}
                    </v-chip>
                </v-col>

                <!-- Status selector Admin -->
                <v-col cols="12" class="mb-2">
                    <v-select
                        v-model="formModel.status"
                        :items="statusItems"
                        item-title="label"
                        item-value="value"
                        label="Update Status"
                        variant="outlined"
                        density="comfortable"
                    />
                </v-col>
             </v-row>

            <!-- ADD / EDIT MODE -->
            <v-form v-else ref="formRef" v-model="isFormValid">
                <v-row no-gutters>
                    
                    <v-col cols="12" class="mb-2">
                        <v-text-field
                        v-model="formModel.name"
                        label="Name"
                        :rules="[requiredRule]"
                        />
                    </v-col>

                    
                    <v-col cols="6" class="mb-2">
                        <v-text-field
                        v-model="formModel.email"
                        label="Email"
                        :rules="[requiredRule]"
                        />
                    </v-col>

                    <v-col cols="6" class="mb-2">
                        <v-text-field
                            v-model="formModel.phone"
                            label="Contact No."
                            :rules="[requiredRule]"
                        />
                    </v-col>

                    <v-col cols="12" class="mb-2">
                        <v-text-field
                            v-model="formModel.address"
                            label="Street / House No./Brgy"
                            :rules="[requiredRule]"
                        />
                    </v-col>

                   <v-col cols="6" class="mb-2">
                        <v-select
                            v-model="formModel.location"
                            :items="deliveryLocations"
                            item-title="label"
                            item-value="value"
                            label="City / Municipality"
                            :rules="[requiredRule]"
                            @update:modelValue="updateDeliveryFee"
                        />
                    </v-col>

                   
                    <v-col cols="6" class="mb-2">
                        <v-text-field v-model="formModel.deliveryDate" label="Delivery Date" type="date" :rules="[requiredRule]" />
                    </v-col>      

                    <v-col cols="6" class="mb-2">
                        <v-text-field
                            :model-value="formModel.deliveryFee ? `₱${formModel.deliveryFee}` : ''"
                            label="Delivery Fee"
                            readonly
                            variant="outlined"
                            hint="Based on delivery location"
                        />
                    </v-col>

                     <v-col cols="6" class="mb-2">
                        <v-text-field v-model="formModel.note" label="Note" />
                    </v-col>

                    <!-- Payment Method -->
                    <v-col cols="12" class="mb-2">
                        <v-radio-group 
                            v-model="formModel.paymentMethod" 
                            label="Payment Method"
                            :rules="[requiredRule]"
                        >
                            <v-radio label="Cash on Delivery (COD)" value="cod" />
                            <v-radio 
                                label="GCash / Card (PayMongo) — Coming Soon" 
                                value="gcash" 
                                disabled 
                            />
                        </v-radio-group>
                    </v-col>

                    <v-divider class="mt-2 mb-3" />

                    <!-- Total Summary -->
                    <v-divider class="mt-2 mb-3" />
                    <v-row no-gutters class="px-1">
                        <v-col cols="12" class="d-flex justify-space-between">
                            <span class="text-caption text-grey">Items Subtotal:</span>
                            <span class="text-caption">₱{{ (formModel.totalAmount || 0) - (formModel.deliveryFee || 0) }}</span>
                        </v-col>
                        <v-col cols="12" class="d-flex justify-space-between mt-1">
                            <span class="text-caption text-grey">Delivery Fee:</span>
                            <span class="text-caption">₱{{ formModel.deliveryFee || 0 }}</span>
                        </v-col>
                        <v-divider class="my-2" />
                        <v-col cols="12" class="d-flex justify-space-between">
                            <span class="font-weight-bold">Total Amount:</span>
                            <span class="font-weight-bold text-amber-darken-2">₱{{ formModel.totalAmount || 0 }}</span>
                        </v-col>
                    </v-row>
                </v-row>
            </v-form>
        </v-card-text>

        <v-toolbar density="compact">
            <!--VIEW MODE-->
            <template v-if="mode === 'view'">
                <v-col cols="6">
                    <v-btn
                    block
                    variant="text"
                    size="48"
                    @click="$emit('close')"
                    >
                        close
                    </v-btn>
                </v-col>

               <v-col cols="6">
                    <v-btn block variant="flat" color="black" size="48" @click="emits('submit:update')">
                        Update Status
                    </v-btn>
               </v-col>
            </template>

            <!--ADD MODE BUTTONS-->
            <template v-if ="mode === 'add'">
                <v-col cols="6">
                    <v-btn
                    block
                    variant="text"
                    class="text-none"
                    size="48"
                    @click="emits('cancel')"
                    >
                        Cancel
                    </v-btn>
                </v-col>

                <v-col cols="6">
                    <v-btn
                    block
                    variant="flat"
                    color="black"
                    size="48"
                    :disabled="!isFormValid"
                    @click="emits('submit:add')"
                    >
                        Submit
                    </v-btn>
                </v-col>
            </template>
        </v-toolbar>
    </v-card>
</template>

<script setup lang="ts">

const props = defineProps({
    title:{
        type: String,
        default: "Order Form"
    },
    mode:{
        type: String,
        default: "add"
    },
       hasFuneralWreath: {
        type: Boolean,
        default: false,
    }
});

const emits = defineEmits([
  "edit",
  "delete",
  "submit:add",
  "submit:update",
  "cancel",
  "close",
]);

const formModel = defineModel("form", {
    type: Object as PropType<TOrder>,
    default: () => ({
        name: "",
        email: "",
        phone: "",
        address: "",
        note: "",
        deliveryDate: "",
        status: "",
        totalAmount: 0,
    }),
})
 
const { getAll: getAllDelivery } = useDelivery()

const { data: deliveryData } = await useLazyAsyncData(
  'delivery-locations-form',
  () => getAllDelivery()
)

// statusItems
const statusItems = [
     { label: "Pending", value: "pending" },
    { label: "Confirmed", value: "confirmed" },
    { label: "Delivered", value: "delivered" },
]

const isFormValid = ref(false);
const requiredRule = (v: any) => !!v || "This field is required";


//Transpo Fee


const motorcycleRates = computed(() => 
  deliveryData.value?.items.map((item: TDelivery) => ({
    label: item.locationName,
    value: item.locationName,
    fee: item.motorcycleFee
  })) ?? []
)

const sedanRates = computed(() => 
  deliveryData.value?.items.map((item: TDelivery) => ({
    label: item.locationName,
    value: item.locationName,
    fee: item.sedanFee
  })) ?? []
)

const deliveryLocations = computed(() => 
    props.hasFuneralWreath ? sedanRates.value : motorcycleRates.value
)

function updateDeliveryFee(value: string) {
    const selected = deliveryLocations.value.find((l: any) => l.value === value);
    if (selected) {
        formModel.value.deliveryFee = Number(selected.fee);
    }
}
</script>