import { Search, MoreHorizontal, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function Header() {
  return (
    <header className="border-b border-border bg-background px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Search */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search Treatments" className="pl-10 bg-muted/50 border-muted" />
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" className="text-muted-foreground bg-transparent">
            Last 30 d
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>

          <Button variant="ghost" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>

          {/* User Profile */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-white">SH</span>
            </div>
            <span className="text-sm font-medium">Sana Health</span>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      </div>
    </header>
  )
}