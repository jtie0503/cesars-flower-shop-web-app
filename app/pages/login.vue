<template>
  <v-app>
    <v-main>
      <v-row no-gutters class="fill-height pa-8" justify="center" align-content="center">
        <v-col cols="12" lg="3" md="4" sm="6">
          <v-form v-model="isValid" @submit.prevent="handleLogin">
            <v-row no-gutters>
              
              <!-- Title -->
              <v-col cols="12" class="text-center mb-6">
                <h1 class="text-h4 font-weight-bold">🌸 Cesar's Flower Shop</h1>
                <p class="text-grey">Admin Panel</p>
              </v-col>

              <!-- Email -->
              <v-col cols="12" class="mb-2">
                <v-text-field
                  v-model="email"
                  label="Email"
                  :rules="[requiredRule]"
                  variant="outlined"
                />
              </v-col>

              <!-- Password -->
              <v-col cols="12" class="mb-2">
                <v-text-field
                  v-model="password"
                  label="Password"
                  type="password"
                  :rules="[requiredRule]"
                  variant="outlined"
                />
              </v-col>

              <!-- Error message -->
              <v-col cols="12" class="text-center text-red mb-2" v-if="message">
                {{ message }}
              </v-col>

              <!-- Login button -->
              <v-col cols="12">
                <v-btn
                  block
                  type="submit"
                  color="amber-darken-2"
                  variant="flat"
                  size="large"
                  :disabled="!isValid"
                  :loading="loading"
                >
                  Login
                </v-btn>
              </v-col>

            </v-row>
          </v-form>
        </v-col>
      </v-row>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
const email = ref("");
const password = ref("");
const isValid = ref(false);
const loading = ref(false);
const message = ref("");

const requiredRule = (v: any) => !!v || "This field is required";

async function handleLogin() {
  loading.value = true;
  message.value = "";
  try {
    const result = await $fetch("/api/v1/auth/login", {
      method: "POST",
      body: { email: email.value, password: password.value },
    });
    
    // Save token sa cookie
    const token = useCookie("adminToken");
    token.value = (result as any).token;
    
    await navigateTo("/admin");
  } catch (error: any) {
    console.log("Login error:", error); 
    message.value = "Invalid email or password!";
  } finally {
    loading.value = false;
  }
}
</script>