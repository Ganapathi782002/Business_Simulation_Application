export interface SimulationState {
  id: string;
  name: string;
  description: string;
  config: string;
  currentPeriod: number;
  status: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  companies: Company[];
  products: Product[];
  decisions: Decision[];
  marketConditions: MarketConditions[];
  performanceResults: PerformanceResults[];
  productPerformance: ProductPerformance[];
  events: Event[];
}

export interface Simulation {
  id: string;
  name: string;
  description: string;
  currentPeriod: number;
  status: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface Company {
  id: string;
  simulationId: string;
  userId: string;
  name: string;
  description: string;
  logoUrl: string | null;
  cashBalance: number;
  totalAssets: number;
  totalLiabilities: number;
  creditRating: string;
  brandValue: number;
  data: string;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  companyId: string;
  name: string;
  description: string;
  category: string;
  qualityRating: number;
  innovationRating: number;
  sustainabilityRating: number;
  productionCost: number;
  sellingPrice: number;
  inventoryLevel: number;
  productionCapacity: number;
  developmentCost: number;
  marketingBudget: number;
  status: string;
  launchPeriod: number | null;
  discontinuePeriod: number | null;
  data: string;
  createdAt: string;
  updatedAt: string;
}

export interface Decision {
  id: string;
  companyId: string;
  period: number;
  type: string;
  data: string;
  submittedAt: string;
  processed: boolean;
  processedAt: string | null;
}

export interface MarketConditions {
  id: string;
  simulationId: string;
  period: number;
  totalMarketSize: number;
  segmentDistribution: string;
  economicIndicators: string;
  consumerPreferences: string;
  technologyTrends: string;
  sustainabilityImportance: number;
  data: string;
  createdAt: string;
}

export interface PerformanceResults {
  id: string;
  companyId: string;
  period: number;
  revenue: number;
  costs: number;
  profit: number;
  marketShare: number;
  cashFlow: number;
  roi: number;
  customerSatisfaction: number;
  employeeSatisfaction: number;
  sustainabilityScore: number;
  innovationScore: number;
  brandValueChange: number;
  data: string;
  createdAt: string;
}

export interface ProductPerformance {
  id: string;
  productId: string;
  period: number;
  salesVolume: number;
  revenue: number;
  costs: number;
  profit: number;
  marketShare: number;
  customerSatisfaction: number;
  data: string;
  createdAt: string;
}

export interface Event {
  id: string;
  simulationId: string;
  period: number;
  type: string;
  name: string;
  description: string;
  impactArea: string;
  impactStrength: number;
  affectedCompanies: string | null;
  data: string;
  createdAt: string;
}
