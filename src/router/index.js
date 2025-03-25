import { createRouter, createWebHistory } from 'vue-router'
const baseUrl = process.env.NODE_ENV === "production" ? "/agroHelixCalc/" : "/"

const router = createRouter({
  history: createWebHistory(baseUrl),
  routes: [
    {
      path: '/scrapper-conveyor',
      name: 'scrapper conveyor',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/ScraperConveyorView.vue'),
    },
  ],
})

export default router
