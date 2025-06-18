"use client";

import { Decision } from "@/components/simulation/types";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { HandCoins, Factory, Megaphone, FlaskConical, Users, Boxes } from "lucide-react";
import React from "react";

const decisionIcons: { [key: string]: React.ReactNode } = {
    pricing: <HandCoins className="h-5 w-5 text-gray-400" />,
    production: <Factory className="h-5 w-5 text-gray-400" />,
    marketing: <Megaphone className="h-5 w-5 text-gray-400" />,
    research: <FlaskConical className="h-5 w-5 text-gray-400" />,
    human_resources: <Users className="h-5 w-5 text-gray-400" />,
    product_development: <Boxes className="h-5 w-5 text-gray-400" />, // Added icon for status changes
};

// This helper function makes the decision data readable
const formatDecisionData = (decision: Decision): string => {
    try {
        const data = JSON.parse(decision.data);
        switch (decision.type) {
            case 'pricing':
                return `Set price to $${data.price.toLocaleString()} for Product ID: ${data.productId}`;
            case 'production':
                return `Queue ${data.productionVolume.toLocaleString()} units for production for Product ID: ${data.productId}`;
            case 'marketing':
                return `Set marketing budget for Product ID: ${data.productId}`;
            case 'research':
                return `New R&D investment`;
            case 'human_resources':
                return `Hiring: ${data.hiring.newEmployees}, New Avg Salary: $${data.salary.newAverageSalary.toLocaleString()}, Training Budget: $${data.training.budget.toLocaleString()}`;
            case 'product_development':
                if (data.action === 'update_status') {
                    return `Change status of Product ID ${data.productId} to ${data.newStatus}`;
                }
                return "Product development decision."
            default:
                return decision.data;
        }
    } catch (e) {
        return "Could not read decision data.";
    }
};

// This new helper function gets the direct cost of a decision
const getDecisionCost = (decision: Decision): number | null => {
    try {
        const data = JSON.parse(decision.data);
        switch (decision.type) {
            case 'marketing':
                return data.budget;
            case 'research':
                return data.amount;
            case 'human_resources':
                // Note: This only shows the direct training budget cost, not hiring/salary costs which are more complex.
                return data.training?.budget || 0;
            default:
                return null;
        }
    } catch (e) {
        return null;
    }
};


export function DecisionCard({ decision }: { decision: Decision }) {
    const cost = getDecisionCost(decision);

    return (
        <Card className="bg-card/80 border-l-4 border-primary">
            <CardHeader>
                <div className="flex items-start space-x-4">
                    <div>{decisionIcons[decision.type] || <HandCoins className="h-5 w-5 text-gray-400" />}</div>
                    <div className="flex-grow">
                        <CardTitle className="text-base capitalize">{decision.type.replace(/_/g, ' ')}</CardTitle>
                        <CardDescription className="text-sm text-muted-foreground mt-1"> {/* IMPROVED VISIBILITY */}
                            {formatDecisionData(decision)}
                        </CardDescription>
                        
                        {/* NEW COST DISPLAY */}
                        {(cost !== null && cost > 0) && (
                            <p className="text-xs font-semibold text-red-400 mt-2">
                                Cost: -${cost.toLocaleString()}
                            </p>
                        )}
                    </div>
                </div>
            </CardHeader>
        </Card>
    )
}