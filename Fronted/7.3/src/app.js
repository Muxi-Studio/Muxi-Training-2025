// 答案仅供参考
// 页面建议写在不同文件中，不要只写一个文件

import { Routes, Route, Navigate, Outlet, useNavigate, useParams, Link, BrowserRouter,useLocation } from 'react-router-dom';
import { createContext, useContext ,useState} from 'react';
import React from 'react';

const AuthContext = createContext({ isLogin: false, setIsLogin: () => {} });
function Home() {
  return <h1>首页</h1>;
}

function Products() {
  return (
    <div>
      <h1>商品列表</h1>
      <ul>
        <li><a href="/products/1">商品1</a></li>
        <li><a href="/products/2">商品2</a></li>
      </ul>
    </div>
  );
}

function ProductDetail() {
  const { id } = useParams();
  return <h1>商品详情 - ID: {id}</h1>;
}

function ProtectedRoute({ children }) {
  const { isLogin } = useContext(AuthContext);
  const location = useLocation();

  if (!isLogin) {
    // 如果未登录，重定向到登录页面，并记住尝试访问的页面
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setIsLogin } = useContext(AuthContext);

  const login = () => {
    setIsLogin(true);
    // 如果有之前尝试访问的页面，登录后跳转到该页面，否则跳转到 profile
    navigate(location.state?.from || '/profile', { replace: true });
  }

  const quit = () => {
    navigate('/');
  }

  return (
    <div>
      <button onClick={login}>登录</button>
      <button onClick={quit}>取消</button>
    </div>
  );
}
function AuthProvider({ children }) {
  const [isLogin, setIsLogin] = useState(false);

  return (
    <AuthContext.Provider value={{ isLogin, setIsLogin }}>
      {children}
    </AuthContext.Provider>
  );
}
function ProfileLayout() {
  return (
    <div>
      <h1>用户中心</h1>
      <div style={{marginLeft:10,gap:20,display:'flex'}}>
        <Link to="/profile/orders">订单</Link>
        <Link to="/profile/settings">设置</Link>
      </div>
      <Outlet />
    </div>
  );
}

function Orders() {
  return <h2>我的订单</h2>;
}

function Settings() {
  return <h2>账户设置</h2>;
}

function NotFound() {
  return <h1>404 - 页面不存在</h1>;
}

// 主路由配置
function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/products" element={<Products />} />
      <Route path="/products/:id" element={<ProductDetail />} />
      <Route path="/login" element={<Login />} />
      
      <Route path="/profile" element={
        <ProtectedRoute>
          <ProfileLayout />
        </ProtectedRoute>
      }>
        <Route path="orders" element={<Orders />} />
        <Route path="settings" element={<Settings />} />
        <Route index element={<Navigate to="orders" replace />} />
      </Route>
      
      {/* 404路由 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

// 应用入口
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div style={{display: 'flex',
          justifyContent: 'space-between',
          padding: '10px',
          margin:30}}>
          <Link to="/">首页</Link>
          <Link to="/products">商品列表</Link>
          <Link to="/profile">用户中心</Link>
        </div>
        <AppRouter />
      </BrowserRouter>        
    </AuthProvider>
  );
}

export default App;