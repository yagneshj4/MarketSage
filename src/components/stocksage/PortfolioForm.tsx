'use client';

import { useForm, type SubmitHandler, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from '@/components/ui/table';
import { Trash2, Loader2, Plus, Zap, IndianRupee } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { MOCK_STOCKS } from '@/lib/market-data';
import { cn } from '@/lib/utils';

const stockSchema = z.object({
  ticker: z.string().min(1, 'Ticker is required').max(10, 'Ticker is too long').toUpperCase(),
  shares: z.coerce.number().positive('Must be positive'),
  cost: z.coerce.number().positive('Must be positive'),
});

const portfolioFormSchema = z.object({
  stocks: z.array(stockSchema),
  cash: z.coerce.number().min(0, 'Cannot be negative'),
});

type StockFormData = z.infer<typeof stockSchema>;
export type PortfolioFormData = z.infer<typeof portfolioFormSchema>;

type PortfolioFormProps = {
  onAnalyze: (portfolio: PortfolioFormData) => void;
  isLoading: boolean;
};

export function PortfolioForm({ onAnalyze, isLoading }: PortfolioFormProps) {
    const { toast } = useToast();

    const form = useForm<PortfolioFormData>({
        resolver: zodResolver(portfolioFormSchema),
        defaultValues: {
            stocks: [
                { ticker: 'RELIANCE', shares: 10, cost: 2900.00 },
                { ticker: 'TCS', shares: 20, cost: 3850.00 },
                { ticker: 'HDFCBANK', shares: 50, cost: 1500.00 },
            ],
            cash: 50000,
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: 'stocks',
    });

    const addStockForm = useForm<StockFormData>({
        resolver: zodResolver(stockSchema),
        defaultValues: {
            ticker: '',
            shares: 0,
            cost: 0,
        },
    });

    const watchedStocks = form.watch('stocks');
    const watchedCash = form.watch('cash');

    const totalPortfolioValue = watchedStocks.reduce((total, stock) => total + (stock.shares * stock.cost), 0) + (Number(watchedCash) || 0);

    const handleAddStock: SubmitHandler<StockFormData> = (data) => {
        if (fields.some(stock => stock.ticker === data.ticker)) {
            toast({
                title: "Stock already exists",
                description: `You have already added ${data.ticker} to your portfolio.`,
                variant: "destructive",
            });
            return;
        }
        append(data);
        addStockForm.reset({ticker: '', shares: 0, cost: 0});
    };
    
    const handleAnalyze = () => {
        onAnalyze(form.getValues());
    }

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Your Portfolio</CardTitle>
        <CardDescription>Add your stocks and cash balance to get personalized advice.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...addStockForm}>
          <form
            onSubmit={addStockForm.handleSubmit(handleAddStock)}
            className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_auto] items-start gap-4 mb-6"
          >
            <FormField
              control={addStockForm.control}
              name="ticker"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ticker</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., RELIANCE" {...field} list="stock-tickers" />
                  </FormControl>
                  <datalist id="stock-tickers">
                    {MOCK_STOCKS.map((stock) => (
                      <option key={stock.ticker} value={stock.ticker} />
                    ))}
                  </datalist>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={addStockForm.control}
              name="shares"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Shares</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 10" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={addStockForm.control}
              name="cost"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cost/Share</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 2900.00" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="self-end" aria-label="Add Stock">
              <Plus className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">Add</span>
            </Button>
          </form>
        </Form>

        <Form {...form}>
            <div className="space-y-4 mb-6">
              <FormField
                  control={form.control}
                  name="cash"
                  render={({ field }) => (
                      <FormItem>
                      <FormLabel className='flex items-center gap-2'>
                        <IndianRupee className="h-4 w-4 text-green-600" />
                        Available Cash
                      </FormLabel>
                      <FormControl>
                          <Input type="number" {...field} className="font-semibold" />
                      </FormControl>
                      <FormMessage />
                      </FormItem>
                  )}
              />
            </div>
            <div className="overflow-x-auto rounded-md border">
              <Table className='min-w-full'>
                  <TableHeader className="bg-muted/50">
                  <TableRow>
                      <TableHead className="w-[100px] px-4">Ticker</TableHead>
                      <TableHead className="text-right px-4">Shares</TableHead>
                      <TableHead className="text-right px-4">Cost/Share</TableHead>
                      <TableHead className="text-right px-4">Total Value</TableHead>
                      <TableHead className="text-center w-[80px] px-4">Action</TableHead>
                  </TableRow>
                  </TableHeader>
                  <TableBody>
                  {fields.length > 0 ? (
                      fields.map((stock, index) => (
                      <TableRow key={stock.id} className="hover:bg-muted/30">
                          <TableCell className="font-medium px-4">{stock.ticker}</TableCell>
                          <TableCell className="text-right px-4">{stock.shares}</TableCell>
                          <TableCell className="text-right px-4">₹{stock.cost.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</TableCell>
                          <TableCell className="text-right font-medium px-4">₹{(stock.shares * stock.cost).toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</TableCell>
                          <TableCell className="text-center px-4">
                          <Button variant="ghost" size="icon" onClick={() => remove(index)}>
                              <Trash2 className="h-4 w-4 text-red-500" />
                              <span className="sr-only">Remove {stock.ticker}</span>
                          </Button>
                          </TableCell>
                      </TableRow>
                      ))
                  ) : (
                      <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                          Your portfolio is empty.
                      </TableCell>
                      </TableRow>
                  )}
                  </TableBody>
                  <TableFooter className={cn(fields.length === 0 && "hidden")}>
                    <TableRow className="bg-muted/50 font-semibold">
                      <TableCell colSpan={3} className="px-4 text-right">Total Portfolio Value</TableCell>
                      <TableCell className="text-right font-bold text-base px-4">
                        ₹{totalPortfolioValue.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                      </TableCell>
                      <TableCell className="px-4"></TableCell>
                    </TableRow>
                  </TableFooter>
              </Table>
            </div>

            <Button onClick={handleAnalyze} disabled={isLoading || fields.length === 0} className="w-full mt-6 text-base font-semibold">
            {isLoading ? (
                <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
                </>
            ) : (
                <>
                <Zap className="mr-2 h-4 w-4" />
                Analyze Portfolio
                </>
            )}
            </Button>
        </Form>
      </CardContent>
    </Card>
  );
}
