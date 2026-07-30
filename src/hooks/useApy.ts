import { useSelector } from 'react-redux'
import type { RootState } from '../redux/store'
import { useAppDispatch } from './useRedux'
import {
  searchCustomers,
  submitApySubscription,
  fetchApySubscription,
  updateApySubscription,
  fetchCustomerApplicationDetails,
  setStep,
  selectCustomer,
  clearCustomerSearch,
  updateFormData,
  setEditId,
  resetForm,
  clearError,
  type CustomerSearchResult,
  type ApyFormData,
} from '../redux/slices/apySlice'

export const useApy = () => {
  const dispatch = useAppDispatch()
  const state = useSelector((state: RootState) => state.apy)

  return {
    ...state,

    searchCust: (query: string) => dispatch(searchCustomers(query)),
    submitRequest: (data: Record<string, any>) =>
      dispatch(submitApySubscription(data)).unwrap(),
    loadRequest: (id: string) => dispatch(fetchApySubscription(id)),
    updateRequest: (payload: { id: string; data: Record<string, any> }) =>
      dispatch(updateApySubscription(payload)).unwrap(),
    fetchAppDetails: (customerId: number) =>
      dispatch(fetchCustomerApplicationDetails(customerId)).unwrap(),

    goToStep: (step: 'customer' | 'form' | 'review' | 'done') => dispatch(setStep(step)),
    pickCustomer: (customer: CustomerSearchResult | null) => dispatch(selectCustomer(customer)),
    clearCustSearch: () => dispatch(clearCustomerSearch()),
    updateForm: (data: Partial<ApyFormData>) => dispatch(updateFormData(data)),
    setEditId: (id: string | null) => dispatch(setEditId(id)),
    reset: () => dispatch(resetForm()),
    clearError: () => dispatch(clearError()),
  }
}
