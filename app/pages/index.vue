<template>
  <v-app-bar height="120" color="amber-lighten-5">
    <!-- Burger icon — mobile only -->
    <v-app-bar-nav-icon 
      v-if="smAndDown" 
      @click="drawer = !drawer"
    />
    <!-- Shop name -->
    <v-app-bar-title >
      <img src="/logo.png.png" alt="logo" height="200" />
    </v-app-bar-title>


    <!-- Desktop links -->
    <!-- Desktop links -->
    <template v-if="mdAndUp">
        <v-btn variant="text" @click="scrollTo('home')">Home</v-btn>
        <v-btn variant="text" @click="scrollTo('products')">Products</v-btn>
        <v-btn variant="text" @click="scrollTo('about')">About</v-btn>
        <v-btn variant="text" @click="scrollTo('contact')">Contact Us</v-btn>
    </template>

    <!-- Cart icon -->
    <v-btn icon @click="cartDrawer = !cartDrawer">
      <v-badge :content="cartCount" color="pink">
        <v-icon>mdi-cart</v-icon>
      </v-badge>
    </v-btn>
  </v-app-bar>

  <!-- Mobile drawer -->
  <v-navigation-drawer v-model="drawer" temporary>
    <v-list>
        <v-list-item title="Home" @click="scrollTo('home'); drawer = false" />
        <v-list-item title="Products" @click="scrollTo('products'); drawer = false" />
        <v-list-item title="About" @click="scrollTo('about'); drawer = false" />
        <v-list-item title="Contact Us" @click="scrollTo('contact'); drawer = false" />
    </v-list>
  </v-navigation-drawer>

<!-- Cart  -->
<v-navigation-drawer v-model="cartDrawer" location="right" temporary width="320">
    <v-toolbar color="amber-lighten-5">
        <v-toolbar-title>🛒 My Cart</v-toolbar-title>
    </v-toolbar>

    <!-- Empty cart -->
    <v-list v-if="cart.length === 0">
        <v-list-item class="text-center text-grey mt-4">
            <v-icon size="48" color="grey-lighten-1">mdi-cart-outline</v-icon>
            <p class="mt-2">Your cart is empty</p>
        </v-list-item>
    </v-list>

    <!-- Cart items -->
   <v-list v-else class="pa-2">
    <v-card
        v-for="item in cart"
        :key="item._id"
        class="mb-2"
        rounded="lg"
        elevation="2"
    >
        <v-row no-gutters align="center">
            <!-- Image -->
            <v-col cols="3">
                <v-img
                    :src="item.imageUrl"
                    height="60"
                    width="60"
                    cover
                    rounded="s-lg"
                />
            </v-col>

            <!-- Details -->
            <v-col cols="9" class="px-2 py-1">
                <p class="text-caption font-weight-bold" style="white-space: normal; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; line-clamp: 2;">{{ item.name }}</p>
                <p class="text-caption text-grey">₱{{ item.price }}</p>
                <p v-if="item.note" class="text-caption text-grey-darken-1 font-italic">
                  📝 {{ item.note }}
                </p>

                <!-- Quantity controls -->
                <v-row no-gutters align="center" class="mt-1">
                    <v-btn icon size="x-small" variant="tonal" @click="item.quantity > 1 ? item.quantity-- : cart.splice(cart.indexOf(item), 1)">
                        <v-icon size="12">mdi-minus</v-icon>
                    </v-btn>
                    <span class="mx-1 text-caption">{{ item.quantity }}</span>
                    <v-btn icon size="x-small" variant="tonal" @click="item.quantity++">
                        <v-icon size="12" color="green">mdi-plus</v-icon>
                    </v-btn>
                    <v-spacer />
                    <v-btn icon size="x-small" variant="text" @click="removeFromCart(item._id!)">
                        <v-icon size="12" color="red">mdi-delete</v-icon>
                    </v-btn>
                </v-row>
            </v-col>
        </v-row>
    </v-card>
</v-list>

    <!-- Total + Checkout -->
    <template #append>
        <v-divider />
        <div class="pa-4">
            <div class="text-h6 mb-3">Total: ₱{{ cartTotal }}</div>
            <v-btn
                block
                color="amber-darken-2"
                variant="flat"
                :disabled="cart.length === 0"
                @click="checkoutDialog = true"
            >
                Checkout
            </v-btn>
        </div>
    </template>
</v-navigation-drawer>

  <v-main> 
    <!-- Main content -->
     <!-- Home section -->
  <v-img
  src="/Home.png.png"
  id="home"
  cover
  :height="mdAndUp ? 650 : 400"
  gradient="to bottom, rgba(0,0,0,.5), rgba(0,0,0,.5)"
>
  <v-container class="pa-10 fill-height text-center" align="center">
    <v-row align="center" justify="center">
      <v-col cols="12">
        <h1 class="text-h4 text-md-h3 text-lg-h2 text-white">
          Fresh Flowers for Every Occasion
        </h1>
        <p class="text-body-1 text-md-h6 text-white">
          Beautifully arranged. Thoughtfully delivered.
        </p>

         <v-btn   
          color="amber-lighten-3" 
          :size="mdAndUp ? 'x-large' : 'small'" 
          class="mt-4"
          @click="scrollTo('products')"
        >
          Shop Now
         </v-btn>
      </v-col>
    </v-row>
  </v-container>
</v-img>

<!-- Products section -->
 <v-container id="products">
      <!-- Section Title -->
  <v-row justify="center" class="mb-2">
    <v-col cols="12" class="text-center">
      <h2 class="text-h5 text-md-h4 font-weight-bold">Our Products</h2>
      <p class="text-grey">Browse our fresh flower collections</p>
    </v-col>
  </v-row>

  <!-- Divider -->
  <v-divider class="mb-6" />
     <!-- Category Filter -->
    <v-row class="mb-4 mt-5" justify="center">
        <v-col cols="12" sm="4" md="3">
            <v-select
                v-model="selectedCategory"
                :items="categories"
                label="Filter by Category"
                :style="{ textAlign: 'center' }"
                clearable
                variant="outlined"
                
            />
        </v-col>
    </v-row>

    <v-row>
      <v-col
      v-for="product in products" :key="product._id"
      cols="12" sm="6" md="4" lg="3" class="d-flex"
    >
      <v-card
        rounded="xl"
        elevation="2"
        class="pa-3"
        style="border: 1.5px solid #f5f5f5; width: 100%;"
      >
        <v-img
          :src="product.imageUrl"
          height="180"
          contain
          class="mb-3"
        />

         <v-card-title 
          class="text-subtitle-1 font-weight-bold pa-0 mb-1 text-center"
          style="white-space: normal; word-break: break-word; min-height: 48px;"
        >
          {{ product.name }}
        </v-card-title>

        <v-card-subtitle class="pa-0 mb-2 text-caption text-grey text-center">
          {{ product.category }}
        </v-card-subtitle>

       <p class="text-h6 font-weight-bold text-amber-darken-2 mb-3 text-center">
          ₱{{ product.price }}
        </p>
        <!-- Buttons Row -->
        <v-row no-gutters>
          <v-col>
            <v-btn
              block
              rounded="pill"
              color="bg-amber-darken-2" 
              class="text-white font-weight-bold"
              variant="flat"
              prepend-icon="mdi-cart"
              height="40"
              @click="addToCart(product)"
            >
              Add to cart
            </v-btn>
          </v-col>

          <!-- View icon -->
          <v-col cols="auto" class="ml-2">
            <v-btn
              icon
              rounded="pill"
              variant="tonal"
              class="bg-amber-darken-2 font-weight-bold"
              height="40"
              width="40"
              @click="handleViewProduct(product)"
            >
              <v-icon class="text-white" >mdi-eye</v-icon>
            </v-btn>
          </v-col>
    </v-row>
  </v-card>
</v-col>
    </v-row>
 </v-container>

 <!-- VIEW DETAILS DIALOG -->
<v-dialog v-model="productDialog" max-width="300">
  <v-card>
    <v-img :src ="selectedProduct.imageUrl" 
            height="220" 
            contain
             />
    <v-card-title>{{ selectedProduct.name }}</v-card-title>
    <v-card-subtitle>{{ selectedProduct.category }}</v-card-subtitle>
    <v-card-text>
      <p strong>Description:</p>
      <p>{{ selectedProduct.description }}</p>
    </v-card-text>

    <v-card-actions>
      <v-row no-gutters>
        <v-col cols="6">
          <v-btn 
            block
            variant="flat"
            color="black"
            @click="productDialog = false"
          >
            Close
          </v-btn>
        </v-col>
        <v-col cols="6">
          <v-btn 
            block
            color="amber-darken-2" 
            variant="flat"
            @click="addToCart(selectedProduct); productDialog = false"
          >
            <v-icon>mdi-cart-plus</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-card-actions>
  </v-card>
</v-dialog>

<!--Checkout Dialog-->

  <v-dialog 
      v-model="checkoutDialog" max-width="500">
  <v-card>
    <v-card-title>Place Order</v-card-title>
    
     <!-- Loading spinner -->
        <v-overlay v-model="orderLoading" contained class="align-center justify-center">
            <v-progress-circular indeterminate color="amber-darken-2" size="64" />
        </v-overlay>

     <orders-form
      v-model:form="orderForm"
      @submit:add="handleSubmitOrder"
      :loading="orderLoading"
      :has-funeral-wreath="cart.some(item => item.category === 'Funeral Wreath')"
      @cancel="checkoutDialog = false"
     />
  </v-card>
</v-dialog>

<!--Order Note Addcart-->

<v-dialog v-model="addToCartDialog" max-width="380">
  <v-card rounded="xl">
    <v-img :src="pendingProduct?.imageUrl" height="120" contain />
    <v-card-title class="text-subtitle-1 font-weight-bold pt-3">
      {{ pendingProduct?.name }}
    </v-card-title>
    <v-card-subtitle class="text-amber-darken-2 font-weight-bold">
      ₱{{ pendingProduct?.price }}
    </v-card-subtitle>

    <v-card-text>
      <div class="d-flex align-center mb-4">
        <span class="text-body-2 mr-3">Quantity:</span>
        <v-btn icon size="x-small" variant="tonal"
          @click="pendingQty > 1 ? pendingQty-- : null">
          <v-icon size="14">mdi-minus</v-icon>
        </v-btn>
        <span class="mx-3 font-weight-bold">{{ pendingQty }}</span>
        <v-btn icon size="x-small" variant="tonal" color="green"
          @click="pendingQty++">
          <v-icon size="14">mdi-plus</v-icon>
        </v-btn>
      </div>

      <!-- Wrapper + Ribbon — Bouquet only -->
      <template v-if="pendingProduct?.category === 'Flower Boquet'">
        <p class="text-body-2 font-weight-bold mb-2">🎨 Wrapper Color (optional)</p>
        <div class="d-flex flex-wrap gap-2 mb-4">
          <v-avatar
            v-for="w in wrapperColors"
            :key="w.name"
            size="48"
            :style="{
              backgroundColor: w.color,
              border: pendingWrapper === w.name ? '3px solid #FF8F00' : '2px solid #ccc',
              cursor: 'pointer'
            }"
            @click="pendingWrapper = pendingWrapper === w.name ? '' : w.name"
          />
        </div>
        <p v-if="pendingWrapper" class="text-caption text-grey mb-3">Selected: {{ pendingWrapper }}</p>

        <p class="text-body-2 font-weight-bold mb-2">🎀 Ribbon Design (optional)</p>
        <div class="d-flex flex-wrap gap-2 mb-4">
          <div
            v-for="r in ribbons"
            :key="r.name"
            class="d-flex flex-column align-center"
            style="width: 60px; cursor: pointer;"
            @click="pendingRibbon = pendingRibbon?.name === r.name ? null : r"
          >
            <v-avatar size="48" :style="{ border: pendingRibbon?.name === r.name ? '3px solid #FF8F00' : '2px solid #ccc' }">
              <v-img :src="r.url" cover />
            </v-avatar>
            <span class="text-caption text-center mt-1" style="font-size: 9px; line-height: 1.2;">{{ r.name }}</span>
          </div>
        </div>
        <p v-if="pendingRibbon" class="text-caption text-grey mb-3">Selected: {{ pendingRibbon.name }}</p>
      </template>

      <!-- Note/Message field -->
      <v-textarea
        v-model="pendingNote"
        :label="pendingProduct?.category === 'Flower Boquet' 
          ? 'Card Message (optional)' 
          : pendingProduct?.category === 'Funeral Wreath'
          ? 'Condolence Message (optional)'
          : 'Note (optional)'"
        :placeholder="pendingProduct?.category === 'Funeral Wreath' 
          ? 'e.g. Our Deepest Sympathy, With Condolences...' 
          : pendingProduct?.category === 'Flower Boquet'
          ? 'e.g. Happy Anniversary, Happy Birthday...'
          : 'e.g. Special instructions...'"
        variant="outlined"
        density="compact"
        rows="2"
        hide-details
      />
      
    </v-card-text>

   <v-card-actions class="pa-4 pt-0">
    <v-btn variant="text" @click="addToCartDialog = false">Cancel</v-btn>
    <v-spacer />
    <v-btn variant="flat" color="amber-darken-2" 
      @click="confirmAddToCart">
      <v-icon class="mr-1">mdi-cart-plus</v-icon> Add to Cart
    </v-btn>
  </v-card-actions>
  </v-card>
</v-dialog>

<v-snackbar v-model="addedSnackbar" timeout="2000" color="green">
  🛒 Added to cart!
</v-snackbar>

<!--SUCCESS CHECKOUT -->



<v-snackbar v-model="contactSuccess" color="green" timeout="4000">
    ✅ Message sent! We'll get back to you soon. 🌸
</v-snackbar>

<!-- About Us Section -->
<v-container 
    
    fluid
    id="about"
    class="py-12"
    style="
    background-image: url('/bg.png');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    
  "
  
>

  <div style="
    background: rgba(255, 255, 255, 0.85); 
    border-radius: 16px; 
    padding: 60px 40px;
    max-width: 1200px;
    margin: 0 auto;
    box-shadow: 0 8px 32px rgba(0,0,0,0.10);
  ">
    <v-row justify="center" class="mb-6">
    <v-col cols="12" class="text-center">
      <h2 class="text-h5 text-md-h4 font-weight-bold">About Us</h2>
      
  
      <div class="floral-divider mt-4 mb-8">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 60" style="width:100%;height:auto;display:block;">
          <!-- Left vine -->
          <path d="M0,30 Q50,10 100,30 Q150,50 200,30 Q250,10 300,30" fill="none" stroke="#4a7c59" stroke-width="2" stroke-linecap="round"/>
          <!-- Right vine -->
          <path d="M500,30 Q550,10 600,30 Q650,50 700,30 Q750,10 800,30" fill="none" stroke="#4a7c59" stroke-width="2" stroke-linecap="round"/>
          <!-- Left leaves -->
          <ellipse cx="80" cy="22" rx="10" ry="5" fill="#6aaa7e" transform="rotate(-30 80 22)"/>
          <ellipse cx="150" cy="38" rx="10" ry="5" fill="#4a7c59" transform="rotate(25 150 38)"/>
          <ellipse cx="220" cy="22" rx="9" ry="4" fill="#6aaa7e" transform="rotate(-20 220 22)"/>
          <ellipse cx="270" cy="38" rx="9" ry="4" fill="#4a7c59" transform="rotate(30 270 38)"/>
          <!-- Right leaves -->
          <ellipse cx="530" cy="22" rx="10" ry="5" fill="#6aaa7e" transform="rotate(-30 530 22)"/>
          <ellipse cx="600" cy="38" rx="10" ry="5" fill="#4a7c59" transform="rotate(25 600 38)"/>
          <ellipse cx="670" cy="22" rx="9" ry="4" fill="#6aaa7e" transform="rotate(-20 670 22)"/>
          <ellipse cx="730" cy="38" rx="9" ry="4" fill="#4a7c59" transform="rotate(30 730 38)"/>
          <!-- Tendrils left -->
          <path d="M60,28 Q65,18 70,22 Q75,28 68,32" fill="none" stroke="#4a7c59" stroke-width="1.2" stroke-linecap="round"/>
          <path d="M180,32 Q185,20 190,25 Q195,30 188,35" fill="none" stroke="#4a7c59" stroke-width="1.2" stroke-linecap="round"/>
          <!-- Tendrils right -->
          <path d="M560,28 Q565,18 570,22 Q575,28 568,32" fill="none" stroke="#4a7c59" stroke-width="1.2" stroke-linecap="round"/>
          <path d="M690,32 Q695,20 700,25 Q705,30 698,35" fill="none" stroke="#4a7c59" stroke-width="1.2" stroke-linecap="round"/>
          <!-- Connecting vines to center -->
          <path d="M300,30 Q318,18 335,30" fill="none" stroke="#4a7c59" stroke-width="1.8" stroke-linecap="round"/>
          <path d="M335,30 Q368,15 400,30" fill="none" stroke="#4a7c59" stroke-width="1.8" stroke-linecap="round"/>
          <path d="M400,30 Q432,45 465,30" fill="none" stroke="#4a7c59" stroke-width="1.8" stroke-linecap="round"/>
          <path d="M465,30 Q482,18 500,30" fill="none" stroke="#4a7c59" stroke-width="1.8" stroke-linecap="round"/>
          <!-- Left daisy -->
          <circle cx="335" cy="30" r="6" fill="#f5c842"/>
          <ellipse cx="335" cy="20" rx="3.5" ry="5.5" fill="#fff8dc"/>
          <ellipse cx="335" cy="40" rx="3.5" ry="5.5" fill="#fff8dc"/>
          <ellipse cx="325" cy="30" rx="5.5" ry="3.5" fill="#fff8dc"/>
          <ellipse cx="345" cy="30" rx="5.5" ry="3.5" fill="#fff8dc"/>
          <ellipse cx="328" cy="23" rx="3.5" ry="5" fill="#fff8dc" transform="rotate(45 328 23)"/>
          <ellipse cx="342" cy="23" rx="3.5" ry="5" fill="#fff8dc" transform="rotate(-45 342 23)"/>
          <ellipse cx="328" cy="37" rx="3.5" ry="5" fill="#fff8dc" transform="rotate(-45 328 37)"/>
          <ellipse cx="342" cy="37" rx="3.5" ry="5" fill="#fff8dc" transform="rotate(45 342 37)"/>
          <!-- Right daisy -->
          <circle cx="465" cy="30" r="6" fill="#f5c842"/>
          <ellipse cx="465" cy="20" rx="3.5" ry="5.5" fill="#fff8dc"/>
          <ellipse cx="465" cy="40" rx="3.5" ry="5.5" fill="#fff8dc"/>
          <ellipse cx="455" cy="30" rx="5.5" ry="3.5" fill="#fff8dc"/>
          <ellipse cx="475" cy="30" rx="5.5" ry="3.5" fill="#fff8dc"/>
          <ellipse cx="458" cy="23" rx="3.5" ry="5" fill="#fff8dc" transform="rotate(45 458 23)"/>
          <ellipse cx="472" cy="23" rx="3.5" ry="5" fill="#fff8dc" transform="rotate(-45 472 23)"/>
          <ellipse cx="458" cy="37" rx="3.5" ry="5" fill="#fff8dc" transform="rotate(-45 458 37)"/>
          <ellipse cx="472" cy="37" rx="3.5" ry="5" fill="#fff8dc" transform="rotate(45 472 37)"/>
          <!-- Center rose petals -->
          <ellipse cx="400" cy="30" rx="14" ry="9" fill="#e8738a" opacity="0.85"/>
          <ellipse cx="400" cy="30" rx="14" ry="9" fill="#e8738a" transform="rotate(45 400 30)" opacity="0.85"/>
          <ellipse cx="400" cy="30" rx="14" ry="9" fill="#e8738a" transform="rotate(90 400 30)" opacity="0.85"/>
          <ellipse cx="400" cy="30" rx="14" ry="9" fill="#e8738a" transform="rotate(135 400 30)" opacity="0.85"/>
          <circle cx="400" cy="30" r="7" fill="#c0395a"/>
          <circle cx="400" cy="30" r="4" fill="#a02040"/>
          <circle cx="400" cy="30" r="2" fill="#7a1030"/>
        </svg>
      </div>

    </v-col>
  </v-row>

  <v-row align="center" justify="center">
    <v-col cols="12" md="6">
      <h3 class="text-h6 font-weight-bold mb-3">🌸 Cesar's Flower Shop</h3>
      <p class="text-body-1 mb-3">
        Since 1991, Cesar's Flower Shop has been providing fresh, beautiful flowers for every occasion — from weddings and birthdays to funerals and simple expressions of love.
      </p>
      <p class="text-body-1 mb-3">
        With over 30 years of experience, we take pride in every arrangement we create — made with care, passion, and the freshest flowers available.
      </p>
      <p class="text-body-1">
        We believe that flowers have the power to express what words cannot. Let us help you find the perfect arrangement for your special moment. 🌺
      </p>
    </v-col>

    <v-col cols="12" md="6" class="text-center">
      <v-img
        src="/logo.png.png"
        max-width="300"
        class="mx-auto"
      />
    </v-col>
  </v-row>
  </div>
</v-container>

<!-- Contact Us Section -->
<v-container fluid id="contact" class="py-12" style="background-color: #fff8e1;">
  <v-row justify="center" class="mb-6">
    <v-col cols="12" class="text-center">
      <h2 class="text-h5 text-md-h4 font-weight-bold">Contact Us</h2>
      <p class="text-grey">Have a special event? We'd love to help! 🌸</p>
      <v-divider class="mt-4 mb-8" />
    </v-col>
  </v-row>

  <v-row justify="center">
    <!-- Contact Info -->
    <v-col cols="12" md="4" class="mb-6">
      <v-row no-gutters class="mb-4">
        <v-col cols="12" class="d-flex align-center mb-3">
          <v-icon color="amber-darken-2" class="mr-3">mdi-map-marker</v-icon>
         <a 
              href="https://www.google.com/maps/place/Cesar's+Flower+Shop/@14.4613872,120.8746473,12z/data=!4m10!1m2!2m1!1scesar+flower+shop!3m6!1s0x3397ce490a1ced39:0xb079456164798be!8m2!3d14.4613872!4d121.0270826!15sChFjZXNhciBmbG93ZXIgc2hvcJIBEWRyaWVkX2Zsb3dlcl9zaG9w4AEA!16s%2Fg%2F11cks7n75v?entry=ttu&g_ep=EgoyMDI2MDMwNS4wIKXMDSoASAFQAw%3D%3D" 
              target="_blank"
              style="color: inherit; text-decoration: none;"
          >
              Elorde Cmpd Cesar's Flower Shop
          </a>
        </v-col>
        <v-col cols="12" class="d-flex align-center mb-3">
          <v-icon color="amber-darken-2" class="mr-3">mdi-phone</v-icon>
         <a 
              href="tel:+63992224545" 
              style="color: inherit; text-decoration: none;"
          >
              +63 9497303415
          </a>
        </v-col>
        <v-col cols="12" class="d-flex align-center">
          <v-icon color="amber-darken-2" class="mr-3" >mdi-email</v-icon>
           <a 
              href="mailto:flowershopcesars@gmail.com" 
              style="color: inherit; text-decoration: none;"
          >
              flowershopcesars@gmail.com
          </a>
        </v-col>
      </v-row>
    </v-col>

    <!-- Contact Form -->
    <v-col cols="12" md="6">
      <v-card rounded="lg" elevation="4" class="pa-6">
        <h3 class="text-h6 font-weight-bold mb-4">Send us a Message 💌</h3>
        
        <v-text-field
          v-model="contactForm.name"
          label="Your Name"
          variant="outlined"
          density="compact"
          class="mb-3"
        />
        
        <v-text-field
          v-model="contactForm.email"
          label="Your Email"
          variant="outlined"
          density="compact"
          class="mb-3"
        />

        <v-text-field
          v-model="contactForm.phone"
          label="Your Phone Number"
          variant="outlined"
          density="compact"
          class="mb-3"
        />

        <v-select
          v-model="contactForm.eventType"
          :items="eventTypes"
          label="Event Type"
          variant="outlined"
          density="compact"
          class="mb-3"
        />

        <v-textarea
          v-model="contactForm.message"
          label="Message / Special Request"
          variant="outlined"
          density="compact"
          rows="4"
          class="mb-3"
          placeholder="Tell us about your event, budget, preferred flowers, etc."
        />

        <v-btn
          block
         color="amber-lighten-3" 
          variant="flat"
          size="large"
          :loading="contactLoading"
          @click="handleContactSubmit"
        >
          Send Message 🌸
        </v-btn>
      </v-card>
    </v-col>
  </v-row>
</v-container>
<!-- Footer -->
<v-footer class="bg-amber-darken-2 py-6">
  <v-row justify="center" no-gutters>
    <v-col cols="12" class="text-center mb-2">
      <img src="/logo.png.png" alt="logo" height="60" />
    </v-col>

    <!-- Social Media Icons -->
    <v-col cols="12" class="text-center mb-3">
      <!-- Facebook -->
      <v-btn
        icon
        variant="text"
        color="white"
        href="https://www.facebook.com/profile.php?id=100064327226944"
        target="_blank"
      >
        <v-icon size="28">mdi-facebook</v-icon>
      </v-btn>

      
      <v-btn
        icon
        variant="text"
        color="white"
        href="#"
        target="_blank"
      >
        <v-icon size="28">mdi-instagram</v-icon>
      </v-btn>

     
      <v-btn
        icon
        variant="text"
        color="white"
        href="viber://chat?number=+639497303415"
        target="_blank"
      >
        <v-icon size="28">mdi-phone</v-icon>
      </v-btn>
    </v-col>

    <v-col cols="12" class="text-center text-white">
      <p class="text-body-2">© {{ new Date().getFullYear() }} Cesar's Flower Shop. All rights reserved.</p>
      <p class="text-body-2">Since 1991 🌸</p>
    </v-col>
  </v-row>
</v-footer>

  </v-main>
</template>


<script  setup lang="ts">
import OrdersForm from '~/components/ordersForm.vue';

function scrollTo(id: string) {
    const el = document.getElementById(id);
    if (el) {
        const offset = 120; // navbar height mo
        const top = el.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
    }
}

const { smAndDown, mdAndUp } = useDisplay();
const drawer = ref(false);
const cartDrawer = ref(false);


const selectedCategory = ref("");
const categories = ["Flower Boquet", "Flat Spray", "Flower Basket", "Funeral Wreath", "Flower Pot"];

// Wrapper colors
const wrapperColors = [
    { name: "White", color: "#FFFFFF" },
    { name: "Pink", color: "#FFB6C1" },
    { name: "Red", color: "#FF0000" },
    { name: "Purple", color: "#800080" },
    { name: "Gold", color: "#FFD700" },
    { name: "Green", color: "#228B22" },
    { name: "Blue", color: "#4169E1" },
    { name: "Black", color: "#000000" },
];

// Ribbon designs
const ribbons = [
    { name: "Striped", url: "https://res.cloudinary.com/dlg4lve3a/image/upload/v1773547247/Striped_Grosgrain_Ribbon_gnsvjy.png" },
    { name: "Pink Plaid", url: "https://res.cloudinary.com/dlg4lve3a/image/upload/v1773547257/Pink_plaid_ribbon_black_silver_metallic_uea1vf.png" },
    { name: "Satin Gold", url: "https://res.cloudinary.com/dlg4lve3a/image/upload/v1773547264/Satin_Ribbon_with_Gold_Edge_kicukg.png" },
    { name: "Red Stripe", url: "https://res.cloudinary.com/dlg4lve3a/image/upload/v1773547276/Red_grosgrain_ribbon_with_white_stripes_ffolvy.png" },
    { name: "Metallic", url: "https://res.cloudinary.com/dlg4lve3a/image/upload/v1773547283/Metallic_Plaid_Grosgrain_Ribbon_x9n7le.png" },
    { name: "Gold Love", url: "https://res.cloudinary.com/dlg4lve3a/image/upload/v1773547292/Gold_glitterfoil_i_love_you_uzzzpc.png" },
    { name: "White Thin", url: "https://res.cloudinary.com/dlg4lve3a/image/upload/v1773547298/White_thin_stripes_somial.png" },
    { name: "Satin Blue", url: "https://res.cloudinary.com/dlg4lve3a/image/upload/v1773547303/Satin_Ribbon_Blue_with_Gold_Edge_g2yehd.png" },
    { name: "White Base", url: "https://res.cloudinary.com/dlg4lve3a/image/upload/v1773547319/White_grosgrain_base_yykfok.png" },
    { name: "Lime Polka", url: "https://res.cloudinary.com/dlg4lve3a/image/upload/v1773547325/Yellowlime_polka_dots_e1kety.png" },
    { name: "Dark Rose", url: "https://res.cloudinary.com/dlg4lve3a/image/upload/v1773547331/Dark_Green_Jacquard_Ribbon_with_Rose_qxtck5.png" },
    { name: "Baby Blue", url: "https://res.cloudinary.com/dlg4lve3a/image/upload/v1773547338/Baby_blue_satin_polka_dot_ribbon_pi4u3j.png" },
    { name: "Magenta", url: "https://res.cloudinary.com/dlg4lve3a/image/upload/v1773547342/Magentahot_pink_at_light_purple_dots_umczv6.png" },
];

const { getAll } = useProduct();
const products = ref<TProduct[]>([]);

const { data } = await useLazyAsyncData(
    "get-customer-products",
    () => getAll({ category: selectedCategory.value, limit: 100 }),
    { watch: [selectedCategory] }
);

watchEffect(() => {
    if (data.value) {
        products.value = data.value.items;
    }
});


//cart logic 

// Cart
type TCartItem = TProduct & { quantity: number; note:string,wrapper: string; ribbon: string; ribbonUrl: string };
const cart = ref<TCartItem[]>([]);

const addToCartDialog = ref(false);
const pendingProduct = ref<TProduct | null>(null);
const pendingNote = ref('');
const pendingQty = ref(1);
const addedSnackbar = ref(false);

const cartCount = computed(() => cart.value.reduce((sum, item) => sum + item.quantity, 0));

const cartTotal = computed(() => cart.value.reduce((sum, item) => sum + (item.price * item.quantity), 0));

function addToCart(product: TProduct){
  pendingProduct.value = product;
  pendingNote.value ="";
  pendingQty.value =1;
  pendingWrapper.value = '';     
  pendingRibbon.value = null;
  addToCartDialog.value = true;
}

function confirmAddToCart() {
  const product = pendingProduct.value!;
  const existing = cart.value.find(item => item._id === product._id);
  if (existing) {
    existing.quantity += pendingQty.value;
    if (pendingNote.value) existing.note = pendingNote.value;
    if(pendingWrapper.value) existing.wrapper = pendingWrapper.value;
    if(pendingRibbon.value){
      existing.ribbon = pendingRibbon.value.name;
      existing.ribbonUrl = pendingRibbon.value.url;
    }
  } else {
    cart.value.push({ ...product,
                         quantity: pendingQty.value,
                         note: pendingNote.value,
                         wrapper: pendingWrapper.value,
                         ribbon: pendingRibbon.value?.name || '',
                         ribbonUrl: pendingRibbon.value?.url || '',
                        
                        });
  }
  addToCartDialog.value = false;
  addedSnackbar.value = true;
}

function removeFromCart(productId: string){
  cart.value = cart.value.filter(item => item._id !== productId);
} 

const selectedProduct = ref<TProduct>({}as TProduct);
const productDialog = ref(false);

function handleViewProduct(product: TProduct){
  selectedProduct.value = product;
  productDialog.value = true;
}

const checkoutDialog = ref(false);

const { add: createOrder } = useOrder();

const orderForm = ref<TOrder>({
    name: "",
    email: "",
    phone: "",
    address: "",
    note: "",
    deliveryDate: "",
    totalAmount: 0,
    items: [],
    status: "pending",
    location: "",      
    deliveryFee: 0,    
});

watch(() => orderForm.value.deliveryFee, (newFee) => {
    orderForm.value.totalAmount = cartTotal.value + (newFee || 0);
});

// Reset delivery fee and location when cart changes
watch(cart, () => {
    orderForm.value.location = "";
    orderForm.value.deliveryFee = 0;
    orderForm.value.totalAmount = cartTotal.value;
}, { deep: true });

async function handleSubmitOrder() {
    orderLoading.value = true;

    try {
        await createOrder({
            ...orderForm.value,
            items: cart.value.map(item => ({
                productId: item._id!,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                imageUrl: item.imageUrl,
                note: item.note || '',
                wrapper: item.wrapper || '',      
                ribbon: item.ribbon || '',        
                ribbonUrl: item.ribbonUrl || '', 
            })),
            totalAmount: cartTotal.value + (orderForm.value.deliveryFee || 0),
            deliveryFee: orderForm.value.deliveryFee || 0,
            status: "pending",
        });
         const data = useState('order-form')
         data.value = {
                ...orderForm.value,
                items: cart.value.map(item => ({
                    productId: item._id!,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    imageUrl: item.imageUrl,
                    note: item.note || '',
                    wrapper: item.wrapper || '',
                    ribbon: item.ribbon || '',
                    ribbonUrl: item.ribbonUrl || '',
                })),
                totalAmount: cartTotal.value + (orderForm.value.deliveryFee || 0),
                deliveryFee: orderForm.value.deliveryFee || 0,
            }
        checkoutDialog.value = false;
        cart.value = [];
        resetOrderForm();
        orderLoading.value = false;
        navigateTo('/orderConfirmation')
    } catch (error) {
        console.error("Error:", error);
        orderLoading.value = false;
    }
}

function resetOrderForm() {
    orderForm.value = {
        name: "",
        email: "",
        phone: "",
        address: "",
        note: "",
        deliveryDate: "",
        totalAmount: 0,
        items: [],
        status: "pending",
        location: "",
        deliveryFee: 0,
    };
}


// SUCCEESS CHECK OUT


const orderLoading = ref(false);

//for costumize

const eventTypes = [
  "Wedding", 
  "Birthday", 
  "Anniversary", 
  "Funeral", 
  "Graduation",
  "Corporate Event",
  "Valentine's Day",
  "Other"
];

const contactForm = ref({
  name: "",
  email: "",
  phone: "",
  eventType: "",
  message: "",
});

const contactLoading = ref(false);
const contactSuccess = ref(false);

async function handleContactSubmit() {
  contactLoading.value = true;
  try {
    await $fetch("/api/v1/contact", {
      method: "POST",
      body: contactForm.value,
    });
    contactSuccess.value = true;
    contactForm.value = { name: "", email: "", phone: "", eventType: "", message: "" };
  } catch (error) {
    console.error("Error:", error);
  } finally {
    contactLoading.value = false;
  }
}


// wrappers & ribbons

const pendingWrapper = ref('');
const pendingRibbon = ref<{ name: string; url: string } | null>(null);
</script>

<style scoped>
:deep(.v-field__input) {
  text-align: center;
  justify-content: center;

}

.floral-divider {
  max-width: 800px;
  margin: 0 auto;
}

</style>