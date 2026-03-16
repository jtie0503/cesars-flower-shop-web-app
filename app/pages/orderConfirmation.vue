<template>
    <v-container>
        <v-row>
            <v-col cols="12">
                {{ data.name }}
            </v-col>
             <v-col v-for="item in data.items" :key="item.productId">
                {{ item.name }}
                {{ item.price }}
                {{ item.quantity }}
            </v-col>
            <v-col>
                {{ data.totalAmount }}
            </v-col>

            <v-col cols="12">
                <v-btn @click="navigateTo('/')">
                    Continue Shopping
                </v-btn>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
const data = useState<any>('order-form')
</script>