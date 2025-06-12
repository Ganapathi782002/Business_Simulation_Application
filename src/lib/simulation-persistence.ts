import { SimulationState } from "@/components/simulation/types";
import { DatabaseService } from "./database";

export async function saveNewSimulation(state: SimulationState, db: DatabaseService): Promise<void> {
    try{
        await db.createSimulation(state)

        for(const company of state.companies){
            await db.createCompany(company);
        }
        for(const marketCondition of state.marketConditions){
            await db.createMarketConditions(marketCondition);
        }

    }catch(error){
        console.error("Error saving new simulation state to database:", error);
        throw error;
    }
}