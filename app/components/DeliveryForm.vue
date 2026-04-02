<template>
    <v-card width="100%">
         <v-toolbar>
            <v-row no-gutters class="fill-height px-6" align="center">
                <span class="font-weight-bold text-h5">{{ title }}</span>
            </v-row>
        </v-toolbar>

         <v-card-text style="max-height:100vh;overflow: auto">
            <v-row v-if="mode ==='view'" no-gutters>
                <v-col cols="12" class="text-subtitle-1 font-weight-bold mb-2">
                    Delivery  Locationa Name
                </v-col>
                <v-col cols="12" class="mb-2">
                    <strong>Location Name:</strong>{{ formModel.locationName }}
                </v-col>

                <v-col cols="6" class="mb-2">
                    <strong>Motorcycle Fee:</strong>{{ formModel.motorcycleFee }}
                </v-col>

                <v-col cols="6" class="mb-2">
                    <strong>Sedan Fee:</strong>{{ formModel.sedanFee }}
                </v-col>

             </v-row>
                  <!-- ADD / EDIT MODE -->
                 <v-form v-else ref="formRef" v-model="isFormValid">
                    <v-row no-gutters>
                         <v-col cols="12" class="mb-2">
                            <v-text-field
                            v-model="formModel.locationName"
                            label="Location Name"
                            :rules="[requiredRule]"
                            />
                         </v-col>

                        
                        <v-col cols="6" class="mb-2">
                            <v-text-field
                            v-model="formModel.motorcycleFee"
                            label="Motorcycle Fee"
                            type="number"
                            :rules="[requiredRule]"
                            />
                        </v-col>

                        <v-col cols="6" class="mb-2">
                            <v-text-field
                                v-model="formModel.sedanFee"
                                label="Sedan Fee"
                                type="number"
                                :rules="[requiredRule]"
                            />
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
                            <template #activator = "{ props }">
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
        default: "Delivery Form"
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


const formModel = defineModel("form", {
    type: Object as PropType<TDelivery>,
    default: () => ({
        locationName: "",
        motorcycleFee: 0,
        sedanFee:0,
    }),
})

const isFormValid = ref(false);
const requiredRule = (v: any) => !!v || "This field is required";


</script>