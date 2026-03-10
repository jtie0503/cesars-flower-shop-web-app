<template>
    <v-card width="100%">
        <v-toolbar>
            <v-row no-gutters class="fill-height px-6" align="center">
                <span class="font-weight-bold text-h5">{{ title }}</span>
            </v-row>
        </v-toolbar>

        <v-card-text style="max-height:100vh;overflow: auto">
            <v-row v-if="mode === 'view'" no-gutters>

                <v-col cols="12" class="text-subtitle-1 font-weight-bold mb-2">
                    Product Name
                </v-col>

                <v-col cols="12" class="mb-2">
                    <strong>Name:</strong>{{ formModel.name }}
                </v-col>

                <v-col cols="6" class="mb-2">
                    <strong>Description:</strong>{{ formModel.description }}
                </v-col>

                <v-col cols="6" class="mb-2">
                    <strong>Price:</strong>{{ formModel.price }}
                </v-col>

                <v-col cols="6" class="mb-2">
                    <strong>Category:</strong> {{ formModel.category }}
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
                        v-model="formModel.description"
                        label="Description"
                        :rules="[requiredRule]"
                        />
                    </v-col>

                    <v-col cols="6" class="mb-2">
                        <v-text-field
                            v-model="formModel.price"
                            label="Price"
                            type="number"
                            :rules="[requiredRule]"
                        />
                    </v-col>

                    <v-col cols="6" class="mb-2">
                         <v-file-input
                               v-model="imageFile"
                                label="Product Image"
                                accept="image/*"
                                prepend-icon="mdi-camera"                       
                                @change="handleImageUpload"
                            />
                    </v-col>

                     <v-col cols="6" class="mb-2">
                        <v-text-field
                        v-model="formModel.category"
                        label="Category"
                        :rules="[requiredRule]"
                        />
                    </v-col>

                    <v-col cols="6" class="mb-2">
                        <v-select
                        v-model="formModel.status"
                        :items="statusItems"
                        item-title="label"
                        item-value="value"
                        label="Status"
                        variant="outlined"
                    ></v-select>
                    </v-col>      
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
                     <v-menu>
                        <template #activator="{ props }">
                            <v-btn
                                block
                                variant="text"
                                class="text-none"
                                color="black"
                                v-bind="props"
                                size="48"
                            >
                                More Actions
                            </v-btn>
                        </template>
                        <v-list>
                            <v-list-item @click="emits('edit')">
                                <v-list-item-title>Edit</v-list-item-title>
                            </v-list-item>
                            <v-list-item @click="emits('delete')">
                                <v-list-item-title>Delete</v-list-item-title>
                            </v-list-item>
                        </v-list>
                    </v-menu>
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

             <!-- EDIT MODE buttons -->
           <template v-if="mode=== 'edit'">

            <v-col cols="6">
                <v-btn
                tile
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
                tile
                block
                 variant="flat"
                 color="black"
                size="48"
                class="text-none"
                :disabled="!isFormValid"
                @click="emits('submit:update')"
                >
                   Save Changes
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
        default: "Product Form"
    },
    mode:{
        type: String,
        default: "add"
    },
});

const emits = defineEmits([
  "edit",
  "delete",
  "submit:add",
  "submit:update",
  "cancel",
  "close",
]);

const imageFile = ref<File | null>(null);

const formModel = defineModel("form", {
    type: Object as PropType<TProduct>,
    default: () => ({
        name: "",
        description: "",
        price: 0,
        imageUrl: "",
        category: "",
        status: "",
    }),
})
 


// statusItems
const statusItems = [
    { label: "Available", value: "available" },
    { label: "Unavailable", value: "unavailable" },
]

const isFormValid = ref(false);
const requiredRule = (v: any) => !!v || "This field is required";
const uploading = ref(false);

async function handleImageUpload(event: Event) {
     console.log("nag-upload!"); 
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
        const base64 = e.target?.result as string;
        uploading.value = true;
        try {
            const result = await $fetch<{ url: string }>("/api/v1/upload", {
                method: "POST",
                body: { file: base64 },
            });
            formModel.value = { ...formModel.value, imageUrl: result.url };
            console.log("imageUrl:", formModel.value.imageUrl); 
        } catch (error) {
            console.error("Upload failed:", error);
        } finally {
            uploading.value = false;
        }
    };
    reader.readAsDataURL(file);
}
</script>