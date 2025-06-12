import React from 'react';
import { useSimulation } from '../simulation/simulation-context';
import { useDecisionSubmission } from '../simulation/use-decision-submission';
import { useSimulationData } from '../simulation/use-simulation-data';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function Dashboard() {
  const { state, userCompany, companyProducts, advancePeriod, loading, error } = useSimulation();
  const { getCompanyPerformance, getMarketConditions, getMarketEvents, getCurrentPeriod } = useSimulationData();
  const { submitProductDevelopment, submitProduction, submitMarketing, submitPricing } = useDecisionSubmission();

  // Get current period and performance data
  const currentPeriod = getCurrentPeriod();
  const performance = getCompanyPerformance();
  const marketConditions = getMarketConditions();
  const events = getMarketEvents(currentPeriod);

  // Handle advance period
  const handleAdvancePeriod = () => {
    advancePeriod();
  };

  // Handle production decision
  const handleProductionDecision = (productId: string, volume: number) => {
    submitProduction({
      productId,
      productionVolume: volume
    });
  };

  // Handle pricing decision
  const handlePricingDecision = (productId: string, price: number) => {
    submitPricing({
      productId,
      price
    });
  };

  // Handle marketing decision
  const handleMarketingDecision = (productId: string, budget: number) => {
    submitMarketing({
      productId,
      budget
    });
  };

  // Handle new product development
  const handleNewProduct = (data: any) => {
    submitProductDevelopment({
      action: 'new_product',
      ...data
    });
  };

  if (loading) {
    return (
      <div className="p-6">
        <h2 className="text-xl font-semibold">Loading simulation...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <h2 className="text-xl font-semibold text-red-600">Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  if (!userCompany) {
    return (
      <div className="p-6">
        <h2 className="text-xl font-semibold">No company found</h2>
        <p>Please create a company to start the simulation.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{userCompany.name}</h1>
          <p className="text-gray-600">Period {currentPeriod}</p>
        </div>
        <div className="flex items-center space-x-4">
          <Link href="/new-simulation">
            <Button variant="outline">Create New Simulation</Button>
          </Link>
          <button
            onClick={handleAdvancePeriod}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Advance to Next Period
          </button>
        </div>
      </div>

      {/* Financial Overview */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Financial Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 p-4 rounded-md">
            <p className="text-gray-600">Cash Balance</p>
            <p className="text-2xl font-bold text-gray-700">${userCompany.cashBalance.toLocaleString()}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-md">
            <p className="text-gray-600">Total Assets</p>
            <p className="text-2xl font-bold text-gray-700">${userCompany.totalAssets.toLocaleString()}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-md">
            <p className="text-gray-600">Total Liabilities</p>
            <p className="text-2xl font-bold text-gray-700">${userCompany.totalLiabilities.toLocaleString()}</p>
          </div>
        </div>

        {performance && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="text-gray-600">Revenue</p>
              <p className="text-2xl font-bold">${performance.revenue.toLocaleString()}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="text-gray-600">Costs</p>
              <p className="text-2xl font-bold ">${performance.costs.toLocaleString()}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="text-gray-600">Profit</p>
              <p className={`text-2xl font-bold ${performance.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${performance.profit.toLocaleString()}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="text-gray-600">Market Share</p>
              <p className="text-2xl font-bold">{(performance.marketShare * 100).toFixed(1)}%</p>
            </div>
          </div>
        )}
      </div>

      {/* Products */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-black text-xl font-semibold mb-4">Products</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Name
                </th>
                <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Category
                </th>
                <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Quality
                </th>
                <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Price
                </th>
                <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Inventory
                </th>
                <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {companyProducts.map((product) => (
                <tr key={product.id}>
                  <td className="py-2 px-4 border-b border-gray-200 text-gray-900">
                    {product.name}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200 text-gray-900">
                    {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200 text-gray-900">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${product.status === 'active' ? 'bg-green-100 text-green-800' :
                      product.status === 'development' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                      {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                    </span>
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200 text-gray-900">
                    {product.qualityRating.toFixed(1)}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200 text-gray-900">
                    ${product.sellingPrice}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200 text-gray-900">
                    {product.inventoryLevel}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200 text-gray-900">
                    <button
                      onClick={() => handleProductionDecision(product.id, 1000)}
                      className="text-blue-600 hover:text-blue-900 mr-2"
                    >
                      Produce
                    </button>
                    <button
                      onClick={() => handlePricingDecision(product.id, product.sellingPrice + 10)}
                      className="text-green-600 hover:text-green-900 mr-2"
                    >
                      Adjust Price
                    </button>
                    <button
                      onClick={() => handleMarketingDecision(product.id, 10000)}
                      className="text-purple-600 hover:text-purple-900"
                    >
                      Marketing
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4">
          <button
            onClick={() => handleNewProduct({
              name: 'New Product',
              description: 'A new product',
              category: 'mid-range',
              qualityRating: 6,
              innovationRating: 5,
              sustainabilityRating: 5,
              productionCost: 100,
              sellingPrice: 200,
              productionCapacity: 2000,
              developmentCost: 100000,
              developmentTime: 1
            })}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Develop New Product
          </button>
        </div>
      </div>

      {/* Market Information */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-900">Market Information</h2>

        {marketConditions && (
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2 text-gray-600">Market Conditions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-gray-600">Total Market Size</p>
                <p className="text-xl font-bold text-gray-600">${marketConditions.totalMarketSize.toLocaleString()}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-gray-600">Sustainability Importance</p>
                <p className="text-xl font-bold text-gray-600">{(marketConditions.sustainabilityImportance * 100).toFixed(1)}%</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-gray-600">Segments</p>
                <p className="text-xl font-bold text-gray-600">{Object.keys(JSON.parse(marketConditions.segmentDistribution)).length}</p>
              </div>
            </div>
          </div>
        )}

        {events.length > 0 && (
          <div>
            <h3 className="text-lg font-medium mb-2">Market Events</h3>
            <div className="space-y-4">
              {events.map((event) => (
                <div key={event.id} className="bg-yellow-50 p-4 rounded-md">
                  <h4 className="font-semibold">{event.name}</h4>
                  <p className="text-gray-700">{event.description}</p>
                  <div className="mt-2 flex items-center">
                    <span className="text-sm text-gray-600">Impact: {event.impactArea}</span>
                    <span className="mx-2">•</span>
                    <span className="text-sm text-gray-600">
                      Strength: {event.impactStrength > 0 ? '+' : ''}{(event.impactStrength * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
