'use client';

import {useState, useEffect} from 'react';
import {useForm, useFieldArray, type SubmitHandler} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import * as z from 'zod';
import {format, formatDistanceToNow} from 'date-fns';
import type {AnalyzePortfolioOutput} from '@/ai/flows/portfolio-analysis-and-advice';
import {getAnalysisAction} from '@/app/actions/analyze';
import {useToast} from '@/hooks/use-toast';
import {getMockMarketData, MOCK_STOCKS} from '@/lib/market-data';
import {cn} from '@/lib/utils';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from '@/components/ui/form';
import {Input} from '@/components/ui/input';
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter} from '@/components/ui/table';
import {Badge} from '@/components/ui/badge';
import {Skeleton} from '@/components/ui/skeleton';
import {
    TrendingUp, Database, Trash2, Loader2, Plus, Zap, IndianRupee, Clock,
    BrainCircuit, TrendingDown, Circle, Layers, Shield, AlertTriangle,
    ShieldAlert, Percent, ArrowDownCircle, ArrowUpCircle, CreditCard
} from 'lucide-react';

// ============================================
// TYPES & SCHEMAS
// ============================================

type UsageStats = {
    creditsRemaining: number;
    analysesToday: number;
};

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
type PortfolioFormData = z.infer<typeof portfolioFormSchema>;
type Advice = AnalyzePortfolioOutput['advice'][0];

// ============================================
// DISPLAY CONFIGURATIONS
// ============================================

const recommendationDisplay = {
    buy: {
        Icon: TrendingUp,
        label: "Buy",
        className: "bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800"
    },
    sell: {
        Icon: TrendingDown,
        label: "Sell",
        className: "bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800"
    },
    hold: {
        Icon: Circle,
        label: "Hold",
        className: "bg-gray-100 dark:bg-gray-700/50 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-600"
    },
    diversify: {
        Icon: Layers,
        label: "Diversify",
        className: "bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800"
    },
};

const riskDisplay = {
    low: {
        Icon: Shield,
        label: "Low Risk",
        className: "text-green-600 dark:text-green-400 border-green-200 dark:border-green-700"
    },
    medium: {
        Icon: AlertTriangle,
        label: "Medium Risk",
        className: "text-yellow-600 dark:text-yellow-400 border-yellow-200 dark:border-yellow-700"
    },
    high: {
        Icon: ShieldAlert,
        label: "High Risk",
        className: "text-red-600 dark:text-red-400 border-red-200 dark:border-red-700"
    },
};

// ============================================
// SUB-COMPONENTS
// ============================================

function Header({usageStats}: { usageStats: UsageStats }) {
    return (
        <header
            className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-6 bg-card border-b rounded-lg shadow-sm">
            <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold tracking-tight">
                    <span className="text-blue-800 dark:text-blue-400">Market</span>
                    <span className="text-primary">Sage</span>
                </h1>
            </div>
            <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2 text-sm font-medium text-foreground/80">
                    <CreditCard className="h-4 w-4"/>
                    <span>Credits: <span className='font-bold text-foreground'>{usageStats.creditsRemaining}</span> remaining</span>
                    <span className="text-foreground/40">|</span>
                    <span>Usage: <span
                        className='font-bold text-foreground'>{usageStats.analysesToday}</span> {usageStats.analysesToday === 1 ? 'analysis' : 'analyses'} today</span>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span
                  className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
                        <span className="font-medium text-foreground/80">Powered by FlexPrice</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Database className="h-4 w-4 text-blue-500"/>
                        <span className="font-medium text-foreground/80">Powered by Pathway</span>
                    </div>
                </div>
            </div>
        </header>
    );
}

function AnalysisCard({advice}: { advice: Advice }) {
    const displayInfo = recommendationDisplay[advice.recommendation] || recommendationDisplay.hold;
    const riskInfo = riskDisplay[advice.riskLevel] || riskDisplay.medium;

    return (
        <Card className="transition-all hover:shadow-lg dark:bg-card/60">
            <CardHeader className='pb-2'>
                <div className="flex justify-between items-start">
                    <CardTitle className="text-xl font-bold">{advice.ticker}</CardTitle>
                    <Badge className={cn("capitalize text-xs font-semibold", displayInfo.className)}>
                        <displayInfo.Icon className="mr-1 h-3.5 w-3.5"/>
                        {displayInfo.label}
                    </Badge>
                </div>
                <CardDescription className="!mt-2 flex flex-wrap gap-2">
                    <Badge variant="outline" className={cn("capitalize text-xs font-medium", riskInfo.className)}>
                        <riskInfo.Icon className="mr-1 h-3 w-3"/>
                        {riskInfo.label}
                    </Badge>
                    {advice.percentage !== undefined && (
                        <Badge variant="outline" className="text-xs font-medium text-muted-foreground">
                            <Percent className="mr-1 h-3 w-3"/>
                            {advice.percentage.toFixed(2)}% of portfolio
                        </Badge>
                    )}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-foreground/80 dark:text-foreground/70 mb-3">{advice.reason}</p>
                {advice.amount !== undefined && (advice.recommendation === 'buy' || advice.recommendation === 'sell') && (
                    <div className="flex items-center gap-2 text-sm font-semibold">
                        <IndianRupee className="h-4 w-4 text-primary"/>
                        <span>Recommendation: {advice.recommendation === 'buy' ? 'Invest' : 'Sell'}</span>
                        <span className="font-bold text-lg">₹{advice.amount.toLocaleString('en-IN')}</span>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

function RebalanceSummaryCard({advice}: { advice: AnalyzePortfolioOutput['advice'] }) {
    const totalBuy = advice
        .filter(a => (a.recommendation === 'buy' || a.recommendation === 'diversify') && a.amount)
        .reduce((sum, a) => sum + (a.amount ?? 0), 0);

    const totalSell = advice
        .filter(a => a.recommendation === 'sell' && a.amount)
        .reduce((sum, a) => sum + (a.amount ?? 0), 0);

    return (
        <Card className="bg-muted/30 dark:bg-card/30 border-dashed">
            <CardHeader className='pb-4'>
                <CardTitle className="text-lg font-semibold">Rebalance Summary</CardTitle>
                <CardDescription className='!mt-1 text-xs'>
                    Summary of recommended portfolio adjustments.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                        <div className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400 mb-1">
                            <ArrowUpCircle className="h-5 w-5"/>
                            <span className="text-sm font-medium">Total to Invest</span>
                        </div>
                        <p className="text-2xl font-bold">₹{totalBuy.toLocaleString('en-IN')}</p>
                    </div>
                    <div>
                        <div className="flex items-center justify-center gap-2 text-red-600 dark:text-red-400 mb-1">
                            <ArrowDownCircle className="h-5 w-5"/>
                            <span className="text-sm font-medium">Total to Sell</span>
                        </div>
                        <p className="text-2xl font-bold">₹{totalSell.toLocaleString('en-IN')}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

function LoadingSkeletons() {
    return (
        <div className="space-y-6">
            <Card className="shadow-none border-dashed p-6">
                <Skeleton className="h-6 w-3/5 mb-4"/>
                <div className="flex justify-around">
                    <div className='text-center'>
                        <Skeleton className="h-5 w-20 mb-2"/>
                        <Skeleton className="h-7 w-24"/>
                    </div>
                    <div className='text-center'>
                        <Skeleton className="h-5 w-20 mb-2"/>
                        <Skeleton className="h-7 w-24"/>
                    </div>
                </div>
            </Card>
            <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
                {[...Array(2)].map((_, i) => (
                    <Card key={i} className="shadow-none border-dashed p-6">
                        <div className="flex items-center justify-between pb-2">
                            <Skeleton className="h-6 w-24"/>
                            <Skeleton className="h-6 w-16 rounded-md"/>
                        </div>
                        <Skeleton className="h-5 w-20 mt-4"/>
                        <Skeleton className="h-4 w-full mt-4"/>
                        <Skeleton className="h-4 w-5/6 mt-2"/>
                    </Card>
                ))}
            </div>
        </div>
    );
}

function EmptyState() {
    return (
        <div className="flex-grow flex items-center justify-center">
            <div
                className="text-center text-muted-foreground p-8 border-2 border-dashed rounded-lg bg-secondary/30 dark:bg-card/20">
                <BrainCircuit className="mx-auto h-12 w-12 text-primary/50"/>
                <h3 className="mt-4 text-lg font-semibold text-foreground">AI Analysis Awaits</h3>
                <p className="mt-2 text-sm max-w-xs">
                    Add your stocks and cash balance, then click "Analyze Portfolio" to receive your personalized
                    investment advice from MarketSage.
                </p>
            </div>
        </div>
    );
}

// ============================================
// MAIN COMPONENTS
// ============================================

function PortfolioForm({
                           onAnalyze,
                           isLoading
                       }: {
    onAnalyze: (portfolio: PortfolioFormData) => void;
    isLoading: boolean;
}) {
    const {toast} = useToast();

    const form = useForm<PortfolioFormData>({
        resolver: zodResolver(portfolioFormSchema),
        defaultValues: {
            stocks: [
                {ticker: 'RELIANCE', shares: 10, cost: 2900.00},
                {ticker: 'TCS', shares: 20, cost: 3850.00},
                {ticker: 'HDFCBANK', shares: 50, cost: 1500.00},
            ],
            cash: 50000,
        },
    });

    const {fields, append, remove} = useFieldArray({
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
    };

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
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Ticker</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., RELIANCE" {...field} list="stock-tickers"/>
                                    </FormControl>
                                    <datalist id="stock-tickers">
                                        {MOCK_STOCKS.map((stock) => (
                                            <option key={stock.ticker} value={stock.ticker}/>
                                        ))}
                                    </datalist>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={addStockForm.control}
                            name="shares"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Shares</FormLabel>
                                    <FormControl>
                                        <Input type="number" placeholder="e.g., 10" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={addStockForm.control}
                            name="cost"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Cost/Share</FormLabel>
                                    <FormControl>
                                        <Input type="number" placeholder="e.g., 2900.00" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="self-end" aria-label="Add Stock">
                            <Plus className="h-4 w-4 md:mr-2"/>
                            <span className="hidden md:inline">Add</span>
                        </Button>
                    </form>
                </Form>

                <Form {...form}>
                    <div className="space-y-4 mb-6">
                        <FormField
                            control={form.control}
                            name="cash"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel className='flex items-center gap-2'>
                                        <IndianRupee className="h-4 w-4 text-green-600"/>
                                        Available Cash
                                    </FormLabel>
                                    <FormControl>
                                        <Input type="number" {...field} className="font-semibold"/>
                                    </FormControl>
                                    <FormMessage/>
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
                                            <TableCell
                                                className="text-right px-4">₹{stock.cost.toLocaleString('en-IN', {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2
                                            })}</TableCell>
                                            <TableCell
                                                className="text-right font-medium px-4">₹{(stock.shares * stock.cost).toLocaleString('en-IN', {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2
                                            })}</TableCell>
                                            <TableCell className="text-center px-4">
                                                <Button variant="ghost" size="icon" onClick={() => remove(index)}>
                                                    <Trash2 className="h-4 w-4 text-red-500"/>
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
                                        ₹{totalPortfolioValue.toLocaleString('en-IN', {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2
                                    })}
                                    </TableCell>
                                    <TableCell className="px-4"></TableCell>
                                </TableRow>
                            </TableFooter>
                        </Table>
                    </div>

                    <Button onClick={handleAnalyze} disabled={isLoading || fields.length === 0}
                            className="w-full mt-6 text-base font-semibold">
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                                Analyzing...
                            </>
                        ) : (
                            <>
                                <Zap className="mr-2 h-4 w-4"/>
                                Analyze Portfolio
                            </>
                        )}
                    </Button>
                </Form>
            </CardContent>
        </Card>
    );
}

function AnalysisDisplay({
                             analysis,
                             isLoading
                         }: {
    analysis: AnalyzePortfolioOutput | null;
    isLoading: boolean;
}) {
    const [formattedDate, setFormattedDate] = useState({distance: '', time: '', dataTime: ''});

    useEffect(() => {
        if (analysis?.generatedAt) {
            const generatedAtDate = new Date(analysis.generatedAt);
            setFormattedDate({
                distance: formatDistanceToNow(generatedAtDate, {addSuffix: true}),
                time: format(generatedAtDate, "h:mm:ss a"),
                dataTime: format(generatedAtDate, "h:mm a"),
            });
        }
    }, [analysis?.generatedAt]);

    const generatedAt = analysis?.generatedAt;

    return (
        <Card className="h-full min-h-[500px] flex flex-col shadow-sm">
            <CardHeader>
                <CardTitle className="text-xl font-semibold">AI-Generated Analysis</CardTitle>
                {generatedAt && !isLoading && (
                    <div className='flex flex-col gap-2'>
                        <CardDescription className="flex items-center gap-2 !mt-2 text-xs">
                            <Clock className="h-4 w-4 text-muted-foreground"/>
                            <span>Analyzed {formattedDate.distance}</span>
                            <span className='text-muted-foreground'>({formattedDate.time})</span>
                        </CardDescription>
                        <CardDescription className="flex items-center gap-2 !mt-1 text-xs">
                            <Database className="h-4 w-4 text-muted-foreground"/>
                            <span>Data updated via Pathway at {formattedDate.dataTime}</span>
                        </CardDescription>
                    </div>
                )}
            </CardHeader>
            <CardContent className="flex-grow flex flex-col gap-6">
                {isLoading && <LoadingSkeletons/>}
                {!isLoading && !analysis && <EmptyState/>}
                {!isLoading && analysis && (
                    <>
                        <RebalanceSummaryCard advice={analysis.advice}/>
                        <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
                            {analysis.advice.map((item, index) => (
                                <AnalysisCard key={index} advice={item}/>
                            ))}
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    );
}

// ============================================
// MAIN APP COMPONENT
// ============================================

export function MarketSageApp() {
    const [analysis, setAnalysis] = useState<AnalyzePortfolioOutput | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [usageStats, setUsageStats] = useState<UsageStats>({
        creditsRemaining: 50,
        analysesToday: 0,
    });
    const {toast} = useToast();
    const [marketData, setMarketData] = useState<string>('');
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        getMockMarketData().then(setMarketData);
        setIsClient(true);
    }, []);

    const handleAnalyze = async (data: PortfolioFormData) => {
        if (data.stocks.length === 0) {
            toast({
                title: "Portfolio is empty",
                description: "Please add at least one stock to your portfolio.",
                variant: "destructive",
            });
            return;
        }

        setIsLoading(true);
        setAnalysis(null);

        try {
            const freshMarketData = await getMockMarketData();
            setMarketData(freshMarketData);

            const result = await getAnalysisAction({
                portfolio: data.stocks,
                marketData: freshMarketData,
                cash: data.cash
            });
            if (!result || !result.advice) {
                throw new Error("Invalid analysis result from AI.");
            }
            setAnalysis(result);
            setUsageStats((prev) => ({
                creditsRemaining: prev.creditsRemaining > 0 ? prev.creditsRemaining - 1 : 0,
                analysesToday: prev.analysesToday + 1,
            }));
        } catch (error) {
            console.error(error);
            toast({
                title: "Analysis Failed",
                description: "An error occurred while analyzing your portfolio. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    if (!isClient) {
        return null;
    }

    return (
        <div className="container mx-auto max-w-7xl p-4 sm:p-6 lg:p-8 space-y-6">
            <Header usageStats={usageStats}/>
            <div className="grid gap-6 md:grid-cols-5 lg:grid-cols-3">
                <div className="md:col-span-3 lg:col-span-1">
                    <PortfolioForm onAnalyze={handleAnalyze} isLoading={isLoading}/>
                </div>
                <div className="md:col-span-2 lg:col-span-2">
                    <AnalysisDisplay analysis={analysis} isLoading={isLoading}/>
                </div>
            </div>
        </div>
    );
}
