import { cn } from "@/lib/utils"
import {
  BarChart3,
  Users,
  Stethoscope,
  ShoppingCart,
  Gift,
  Network,
  Building2,
  CreditCard,
  Settings,
  ChevronDown,
} from "lucide-react"

const navigation = [
  { name: "Overview", icon: BarChart3, current: true },
  { name: "Customers", icon: Users, current: false },
]

const operations = [
  { name: "Treatments", icon: Stethoscope, current: false },
  { name: "Orders", icon: ShoppingCart, current: false, hasSubmenu: true },
]

const services = [{ name: "Offerings", icon: Gift, current: false, hasSubmenu: true }]

const networks = [
  { name: "Provider Networks", icon: Network, current: false },
  { name: "Pharmacies", icon: Building2, current: false },
  { name: "Coupon Codes", icon: Gift, current: false },
  { name: "Payments", icon: CreditCard, current: false },
]

const configuration = [{ name: "Settings", icon: Settings, current: false }]

export function Sidebar() {
  return (
    <div className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Logo */}
      <div className="p-6">
        <h1 className="text-xl font-bold text-sidebar-foreground">Rimo</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1">
        {/* Main Navigation */}
        <div className="space-y-1">
          {navigation.map((item) => (
            <a
              key={item.name}
              href="#"
              className={cn(
                "group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                item.current
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              )}
            >
              <item.icon className="mr-3 h-4 w-4" />
              {item.name}
            </a>
          ))}
        </div>

        {/* Operations Section */}
        <div className="pt-6">
          <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Operations</h3>
          <div className="space-y-1">
            {operations.map((item) => (
              <a
                key={item.name}
                href="#"
                className="group flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
              >
                <div className="flex items-center">
                  <item.icon className="mr-3 h-4 w-4" />
                  {item.name}
                </div>
                {item.hasSubmenu && <ChevronDown className="h-4 w-4" />}
              </a>
            ))}
          </div>
        </div>

        {/* Services Section */}
        <div className="pt-6">
          <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Services</h3>
          <div className="space-y-1">
            {services.map((item) => (
              <a
                key={item.name}
                href="#"
                className="group flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
              >
                <div className="flex items-center">
                  <item.icon className="mr-3 h-4 w-4" />
                  {item.name}
                </div>
                {item.hasSubmenu && <ChevronDown className="h-4 w-4" />}
              </a>
            ))}
          </div>
        </div>

        {/* Networks Section */}
        <div className="pt-6">
          <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Networks</h3>
          <div className="space-y-1">
            {networks.map((item) => (
              <a
                key={item.name}
                href="#"
                className="group flex items-center px-3 py-2 text-sm font-medium rounded-md text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
              >
                <item.icon className="mr-3 h-4 w-4" />
                {item.name}
              </a>
            ))}
          </div>
        </div>

        {/* Configuration Section */}
        <div className="pt-6">
          <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Configuration
          </h3>
          <div className="space-y-1">
            {configuration.map((item) => (
              <a
                key={item.name}
                href="#"
                className="group flex items-center px-3 py-2 text-sm font-medium rounded-md text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
              >
                <item.icon className="mr-3 h-4 w-4" />
                {item.name}
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-white">AT</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">Adam Taaev</p>
            <p className="text-xs text-muted-foreground truncate">adam@rimo.com</p>
          </div>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </div>
      </div>
    </div>
  )
}