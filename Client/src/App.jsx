import "./App.css";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { SelectRole } from './page/login/SelectRole.jsx';
import { Home } from './page/Home.jsx';
import { AdminLogin } from './page/login/AdminLogin.jsx';
import { UserLogin } from './page/login/UserLogin.jsx';
import { UserLayout } from "./page/user/UserLayout/UserLayout.jsx";
import { Dashboard } from "./page/user/Dashboard/Dashboard.jsx";
import { Warehouse } from "./page/user/warehouse_location/Warehouse.jsx";
import React from "react";
import { AllUser } from "./page/admin/AllUser.jsx";
import { AdminLayout } from "./page/admin/AdminLayout.jsx";
import { Purchase } from "./page/user/Purchase/Purchase.jsx";
import { PurchaseHistory } from "./page/user/History/PurchaseHistory.jsx";
import { Import } from "./page/user/Import/Import.jsx";
import { ImportHistory } from "./page/user/History/ImportHistory.jsx";
import { ShowAllProduct } from "./page/user/Product/ShowAllProduct.jsx";
import { AddNewProduct } from "./page/user/Product/AddNewProduct.jsx";
import { ExportProduct } from "./page/user/Export/ExportProduct.jsx";
import { ExportHistory } from "./page/user/History/ExportHistory.jsx";
import { ProductStatus } from "./page/user/Product/ProductStatus.jsx";



const router = createBrowserRouter([
  {
    path: "*",
    element: <Home />,
  },
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/selectRole",
    element: <SelectRole />,
  },
  {
    path: "adminLogin",
    element: <AdminLogin />,
  },
  {
    path: "userLogin",
    element: <UserLogin />,
  },
  {
    path: "user",
    element: <UserLayout />,
    children: [
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "allProduct",
        element: <ShowAllProduct />,
      },
      {
        path: "ProductStatus",
        element: <ProductStatus />,
      },
      {
        path: "addNewProduct",
        element: <AddNewProduct/>,
      },
      {
        path: "warehouse",
        element: <Warehouse />,
      },
      {
        path: "purchase",
        element: <Purchase />,
      },
      {
        path: "import",
        element: <Import />,
      },
      {
        path: "export",
        element: <ExportProduct />,
      },
      {
        path: "purchaseHistory",
        element: <PurchaseHistory />,
      },
      {
        path: "importHistory",
        element: <ImportHistory />,
      },
      {
        path: "exportHistory",
        element: <ExportHistory />,
      },
      
    ],
  },
  {
    path: "admin",
    element: <AdminLayout />,
    children: [
      {
        path: "showAllUser",
        element: <AllUser/>,
      },
    ],
  },
]);


class App extends React.Component {
  // componentDidMount () {
  //   const script = document.createElement("script")
  //   script.src = 'table.js'
  //   script.async= true
  //   document.body.appendChild(script)
  // }
  
  render(){
    return (
      <>
      <div className="container col-12">
       <RouterProvider router={router}/>
      </div>
      </>
    );
  }
  
}

export default App;
