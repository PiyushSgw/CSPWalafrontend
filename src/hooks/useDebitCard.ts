import { useSelector } from 'react-redux'
import type { RootState } from '../redux/store'
import { useAppDispatch } from './useRedux'
import {
  searchCustomers,
  submitDebitCardRequest,
  fetchMyDebitCardRequests,
  fetchDebitCardRequest,
  setStep,
  selectCustomer,
  clearCustomerSearch,
  updateFormData,
  resetForm,
  clearError,
  type CustomerSearchResult,
  type DebitCardFormData,
} from '../redux/slices/debitCardSlice'

export const useDebitCard = () => {
  const dispatch = useAppDispatch()
  const state = useSelector((state: RootState) => state.debitCard)

  return {
    ...state,

    searchCust: (query: string) => dispatch(searchCustomers(query)),
    submitRequest: (data: { bankId: number; customerId: number; requestData: DebitCardFormData }) =>
      dispatch(submitDebitCardRequest(data)).unwrap(),
    loadRequests: (params: { status?: string } = {}) => dispatch(fetchMyDebitCardRequests(params)),
    loadRequest: (id: string) => dispatch(fetchDebitCardRequest(id)),


    goToStep: (step: 'customer' | 'form' | 'review' | 'done') => dispatch(setStep(step)),
    pickCustomer: (customer: CustomerSearchResult | null) => dispatch(selectCustomer(customer)),
    clearCustSearch: () => dispatch(clearCustomerSearch()),
    updateForm: (data: Partial<DebitCardFormData>) => dispatch(updateFormData(data)),
    reset: () => dispatch(resetForm()),
    clearError: () => dispatch(clearError()),
  }
}
