import { RouterModule, Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Games } from './pages/store-games/games';
import { HowItWorks } from './pages/how-it-works/how-it-works';
import { Contact } from './pages/contact/contact';
import { AboutUs } from './pages/about-us/about-us';
import { ChargeGames } from './pages/charge-games/charge-games';
import { DetailBuyGame } from './details-games/detail-buy-game/detail-buy-game';
import { DetailChargeGame } from './details-games/detail-charge-game/detail-charge-game';
import { Payment } from './pages/payment/payment'
import { AdminLogin } from './admin/admin-login/admin-login';
import { AdminLayout } from './admin/admin-layout/admin-layout';
import { AdminDashboard } from './admin/admin-dashboard/admin-dashboard';
import { AdminOrders } from './admin/admin-orders/admin-orders';
import { AdminCharges } from './admin/admin-charges/admin-charges';
import { AdminGames } from './admin/admin-games/admin-games';
import { AdminGuard } from '../guard/admin.guard';
import { Userlayout } from './layout/userlayout/userlayout';

export const routes: Routes = [
    {
        path:'user',
        component: Userlayout,
        children: [
            {path:'home', component: Home},
            {path:'games', component: Games},
            {path:'how-it-works', component: HowItWorks},
            {path:'contact', component: Contact},
            {path:'about-us', component: AboutUs},
            {path:'charge-games', component: ChargeGames},
            {path:'detail-buy-game/:id', component: DetailBuyGame},
            {path:'detail-charge-game/:id', component: DetailChargeGame},
            {path:'payment/:id', component: Payment},
            {path: 'order-payment/:id', component: Payment},
            {path: 'charge-payment/:id', component: Payment},
            {path:'', redirectTo:'user/home', pathMatch:'full'}
        ]
    },
    {
    path: 'admin/login',
    component: AdminLogin
    },
    {
    path: 'admin',
    component: AdminLayout,
    canActivate: [AdminGuard],
    children: [
        { path: 'dashboard', component: AdminDashboard },
        { path: 'orders', component: AdminOrders },
        { path: 'charges', component: AdminCharges },
        { path: 'games', component: AdminGames }
    ]
    },
    {path:'', redirectTo:'user/home', pathMatch:'full'}


];


