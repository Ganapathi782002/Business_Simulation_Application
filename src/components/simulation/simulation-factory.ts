import { SimulationState } from './types';
import { SimulationEngine } from './simulation-engine';

interface CreateSimulationOptions {
  simulationName: string;
  description: string;
  userId: string;
}

/**
 * Factory class to create simulation instances
 */
export class SimulationFactory {

  //Creating a Simulation with user data
  public static create(options: CreateSimulationOptions): SimulationState {
    const now = new Date().toISOString();
    const simId = `sim_${Date.now()}`;
    const companyId = `company_${Date.now()}`;
    const initialState: SimulationState = {
      id: simId,
      name: options.simulationName,
      description: options.description,
      config: JSON.stringify({}),
      currentPeriod: 0,
      status: 'active',
      createdBy: options.userId,
      createdAt: now,
      updatedAt: now,
      companies: [],
      products: [],
      decisions: [],
      marketConditions: [
        {
          id: `market_${simId}_0`,
          simulationId: simId,
          period: 0,
          totalMarketSize: 50000000,
          segmentDistribution: JSON.stringify({ premium: 0.3, 'mid-range': 0.5, budget: 0.2 }),
          economicIndicators: JSON.stringify({ gdp_growth: 0.02, inflation_rate: 0.01, interest_rate: 0.03, unemployment_rate: 0.05, consumer_confidence: 70, business_sentiment: 75 }),
          consumerPreferences: JSON.stringify({ premium: { quality_sensitivity: 0.8, price_sensitivity: 0.3 }, 'mid-range': { quality_sensitivity: 0.5, price_sensitivity: 0.5 }, budget: { quality_sensitivity: 0.2, price_sensitivity: 0.8 } }),
          technologyTrends: JSON.stringify([]),
          sustainabilityImportance: 0.3,
          data: JSON.stringify({}),
          createdAt: now,
        }
      ],
      performanceResults: [],
      productPerformance: [],
      events: [],
    };

    return initialState;
  }
  /**
   * Create a new simulation with demo data
   */
  static createDemoSimulation(): SimulationEngine {
    const initialState: SimulationState = {
      id: 'sim_demo',
      name: 'Business Strategy Simulation',
      description: 'A simulation focused on strategic decision-making',
      config: JSON.stringify({
        initialCash: 1000000,
        periods: 12,
        marketSegments: ['budget', 'mid-range', 'premium'],
        difficulty: 'medium',
        eventsFrequency: 0.3
      }),
      currentPeriod: 0,
      status: 'active',
      createdBy: 'user_demo',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      companies: [
        {
          id: 'company_demo',
          simulationId: 'sim_demo',
          userId: 'user_demo',
          name: 'TechInnovate Inc.',
          description: 'A technology innovation company',
          logoUrl: null,
          cashBalance: 1000000,
          totalAssets: 1000000,
          totalLiabilities: 0,
          creditRating: 'B',
          brandValue: 50,
          data: JSON.stringify({
            missionStatement: 'To innovate and transform technology',
            competitiveStrategy: 'differentiator',
            humanResources: {
              totalEmployees: 100,
              averageSalary: 50000,
              trainingBudget: 0,
              employeeSatisfaction: 50,
              productivity: 1,
              turnoverRate: 0.15
            }
          }),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ],
      products: [
        {
          id: 'product_demo_1',
          companyId: 'company_demo',
          name: 'Premium Widget',
          description: 'Our flagship premium widget',
          category: 'premium',
          qualityRating: 8.5,
          innovationRating: 7.2,
          sustainabilityRating: 6.8,
          productionCost: 150,
          sellingPrice: 300,
          inventoryLevel: 1000,
          productionCapacity: 2000,
          developmentCost: 200000,
          marketingBudget: 50000,
          status: 'active',
          launchPeriod: 0,
          discontinuePeriod: null,
          data: JSON.stringify({
            features: ['Advanced AI', 'Premium Materials', 'Extended Warranty'],
            targetAudience: 'High-income professionals'
          }),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 'product_demo_2',
          companyId: 'company_demo',
          name: 'Standard Widget',
          description: 'Our mid-range widget offering',
          category: 'mid-range',
          qualityRating: 6.5,
          innovationRating: 5.8,
          sustainabilityRating: 6.0,
          productionCost: 75,
          sellingPrice: 150,
          inventoryLevel: 1500,
          productionCapacity: 3000,
          developmentCost: 100000,
          marketingBudget: 30000,
          status: 'active',
          launchPeriod: 0,
          discontinuePeriod: null,
          data: JSON.stringify({
            features: ['Reliable Performance', 'Good Value'],
            targetAudience: 'Middle-income consumers'
          }),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 'product_demo_3',
          companyId: 'company_demo',
          name: 'Basic Widget',
          description: 'Our entry-level widget',
          category: 'budget',
          qualityRating: 4.5,
          innovationRating: 3.2,
          sustainabilityRating: 5.0,
          productionCost: 40,
          sellingPrice: 80,
          inventoryLevel: 0,
          productionCapacity: 4000,
          developmentCost: 50000,
          marketingBudget: 0,
          status: 'development',
          launchPeriod: 1,
          discontinuePeriod: null,
          data: JSON.stringify({
            features: ['Essential Functionality', 'Affordable'],
            targetAudience: 'Budget-conscious consumers'
          }),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ],
      decisions: [],
      marketConditions: [
        {
          id: 'market_demo_0',
          simulationId: 'sim_demo',
          period: 0,
          totalMarketSize: 5000000,
          segmentDistribution: JSON.stringify({
            budget: 0.3,
            'mid-range': 0.4,
            premium: 0.3
          }),
          economicIndicators: JSON.stringify({
            gdp_growth: 0.028,
            inflation_rate: 0.021,
            interest_rate: 0.035,
            unemployment_rate: 0.042,
            consumer_confidence: 102.8,
            business_sentiment: 56.4
          }),
          consumerPreferences: JSON.stringify({
            budget: {
              price_sensitivity: 0.8,
              quality_sensitivity: 0.3,
              brand_loyalty: 0.2,
              innovation_preference: 0.2,
              sustainability_preference: 0.2
            },
            'mid-range': {
              price_sensitivity: 0.5,
              quality_sensitivity: 0.5,
              brand_loyalty: 0.4,
              innovation_preference: 0.4,
              sustainability_preference: 0.4
            },
            premium: {
              price_sensitivity: 0.3,
              quality_sensitivity: 0.8,
              brand_loyalty: 0.7,
              innovation_preference: 0.6,
              sustainability_preference: 0.6
            }
          }),
          technologyTrends: JSON.stringify([
            {
              name: 'AI and Machine Learning',
              impact_area: 'product_development',
              impact_strength: 0.25,
              adoption_rate: 0.4
            },
            {
              name: 'Internet of Things',
              impact_area: 'customer_experience',
              impact_strength: 0.2,
              adoption_rate: 0.35
            }
          ]),
          sustainabilityImportance: 0.67,
          data: '{}',
          createdAt: new Date().toISOString()
        }
      ],
      performanceResults: [],
      productPerformance: [],
      events: []
    };

    return new SimulationEngine(initialState);
  }
}
