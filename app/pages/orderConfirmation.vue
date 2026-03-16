<template>
    <v-container class="py-10" style="max-width: 600px;">
        <v-row justify="center">

            <!-- Thank You Header -->
            <v-col cols="12" class="text-center mb-4">
                <v-icon size="64" color="green">mdi-check-circle</v-icon>
                <h1 class="text-h5 font-weight-bold mt-3">Thank you, {{ data.name }}! 🌸</h1>
                <p class="text-grey mt-2">Your order has been received!</p>
                <v-chip color="amber-darken-2" class="mt-2">
                    📧 Check your email for your order details
                </v-chip>
            </v-col>

            <!-- Order Summary Card -->
            <v-col cols="12">
                <v-card rounded="xl" elevation="3" class="pa-4">
                    <v-card-title class="text-subtitle-1 font-weight-bold mb-2">
                        🛍️ Order Summary
                    </v-card-title>

                    <v-divider class="mb-3" />

                    <!-- Items -->
                    <v-card
                        v-for="item in data.items"
                        :key="item.productId"
                        class="mb-3"
                        variant="outlined"
                        rounded="lg"
                    >
                        <v-row no-gutters align="center" class="pa-2">
                            <v-col cols="3">
                                <v-img
                                    :src="item.imageUrl || '/logo.png.png'"
                                    height="60"
                                    cover
                                    rounded="lg"
                                />
                            </v-col>
                            <v-col cols="9" class="pl-3">
                                <p class="font-weight-bold text-body-2">{{ item.name }}</p>
                                <p class="text-caption text-grey">x{{ item.quantity }}</p>
                                <p class="text-caption font-weight-bold text-amber-darken-2">
                                    ₱{{ item.price * item.quantity }}
                                </p>
                            </v-col>
                        </v-row>
                    </v-card>

                    <v-divider class="mt-2 mb-3" />

                    <!-- Total -->
                    <v-row no-gutters class="px-2">
                        <v-col class="font-weight-bold text-h6">Total</v-col>
                        <v-col class="text-right font-weight-bold text-h6 text-amber-darken-2">
                            ₱{{ data.totalAmount }}
                        </v-col>
                    </v-row>
                </v-card>
            </v-col>

            <!-- Continue Shopping Button -->
            <v-col cols="12" class="text-center mt-4">
                <v-btn
                    color="amber-darken-2"
                    variant="flat"
                    size="large"
                    rounded="pill"
                    @click="navigateTo('/')"
                >
                    🛒 Continue Shopping
                </v-btn>
            </v-col>

        </v-row>
    </v-container>
</template>

<script setup lang="ts">
const data = useState<any>('order-form')
</script>