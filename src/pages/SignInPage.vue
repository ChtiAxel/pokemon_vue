<template>
  <NForm @submit.prevent="handleSignIn">
    <NFormItem label="Email" required style="width: 100%">
      <NInput v-model:value="email" round type="text" placeholder="Email" />
    </NFormItem>
    <NFormItem label="Mot de passe" required style="width: 100%">
      <NInput
        v-model:value="password"
        round
        type="password"
        show-password-on="mousedown"
        placeholder="Password"
      />
    </NFormItem>
    <NButton type="primary" round attr-type="submit" style="width: 100%"
      >Se connecter</NButton
    >
    <div class="footer">
      <p>
        Pas encore de compte ?
        <RouterLink to="/sign-up"><span>S'inscrire</span></RouterLink>
      </p>
    </div>
  </NForm>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import { useAuthStore } from '@/stores/auth.store'

const authStore = useAuthStore()
const router = useRouter()

const email = ref('')
const password = ref('')

const handleSignIn = async () => {
  await authStore.signIn({
    email: email.value,
    password: password.value,
  })
  await router.push('/')
}
</script>

<style scoped>
.footer {
  display: flex;
  justify-content: center;
}

.footer span {
  text-decoration: none;
  transition: all 0.3s;
}

.footer span:hover {
  color: violet;
}
</style>
