"use client"

import * as React from "react"
import { X, Check, ChevronsUpDown, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"

export type Ingredient = {
  id: string
  name: string
  type: 'ingredient' | 'additive'
}

interface MultiSelectIngredientsProps {
  selected?: Ingredient[]
  onChange: (selected: Ingredient[]) => void
  className?: string
}

export function MultiSelectIngredients({
  selected = [],
  onChange,
  className,
}: MultiSelectIngredientsProps) {
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState("")
  const [results, setResults] = React.useState<Ingredient[]>([])
  const [loading, setLoading] = React.useState(false)

  // Debounce search
  React.useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.length < 2) {
        setResults([])
        return
      }

      setLoading(true)
      try {
        const res = await fetch(`/api/ingredients/search?q=${encodeURIComponent(query)}`)
        const data = await res.json()
        setResults(data.results || [])
      } catch (error) {
        console.error("Failed to fetch ingredients:", error)
      } finally {
        setLoading(false)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [query])

  const handleSelect = (ingredient: Ingredient) => {
    if (selected.some((item) => item.id === ingredient.id)) {
        onChange(selected.filter((item) => item.id !== ingredient.id))
    } else {
        onChange([...selected, ingredient])
    }
  }

  const handleRemove = (id: string) => {
    onChange(selected.filter((item) => item.id !== id))
  }

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between h-auto min-h-[44px] py-3 text-left font-normal"
          >
             <span className="text-muted-foreground">
                {selected.length > 0 ? `${selected.length} items selected` : "Search ingredients..."}
             </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[400px] p-0" align="start">
          <Command shouldFilter={false}>
            <CommandInput 
                placeholder="Search ingredients (e.g., 'soy', 'E102')..." 
                value={query}
                onValueChange={setQuery}
            />
            <CommandList>
                {loading && <div className="p-4 text-sm text-center text-muted-foreground">Loading...</div>}
                {!loading && query.length > 0 && results.length === 0 && (
                    <CommandEmpty>No ingredients found.</CommandEmpty>
                )}
                {!loading && query.length < 2 && (
                    <div className="p-4 text-sm text-center text-muted-foreground">Type at least 2 characters to search.</div>
                )}
                {!loading && results.length > 0 && (
                    <CommandGroup heading="Suggestions">
                        {results.map((ingredient) => {
                            const isSelected = selected.some(i => i.id === ingredient.id)
                            return (
                                <CommandItem
                                    key={ingredient.id}
                                    value={ingredient.name}
                                    onSelect={() => handleSelect(ingredient)}
                                >
                                    <Check
                                        className={cn(
                                        "mr-2 h-4 w-4",
                                        isSelected ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    <div className="flex flex-col">
                                        <span>{ingredient.name}</span>
                                        <span className="text-[10px] text-muted-foreground uppercase">{ingredient.type}</span>
                                    </div>
                                </CommandItem>
                            )
                        })}
                    </CommandGroup>
                )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Selected Tags */}
      {selected.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {selected.map((item) => (
                <Badge key={item.id} variant="secondary" className="pl-2 pr-1 py-1 flex items-center gap-1">
                    {item.name}
                    <button 
                        onClick={() => handleRemove(item.id)}
                        className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5 transition-colors"
                    >
                        <X className="h-3 w-3" />
                        <span className="sr-only">Remove {item.name}</span>
                    </button>
                </Badge>
            ))}
          </div>
      )}
    </div>
  )
}
