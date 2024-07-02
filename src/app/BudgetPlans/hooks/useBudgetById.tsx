import { useQuery } from "@tanstack/react-query"
import axios from "axios"

const useBudgetById = (params: { budgetID: string } | null) => {

    const { isPending, error, data } = useQuery({
        queryKey: ['repoData'],
        queryFn: async () => {
            if (params === null) return
            return await axios.post(
                "https://asesoresoc.oceanicadeseguros.com/asg-api/dbo/budgets/get_budget_by_id",
                { p_budget_id: params?.budgetID }
            )
        }
    })

    return { isPending, error, data }
}

export default useBudgetById