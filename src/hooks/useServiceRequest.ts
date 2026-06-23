import { useSelector } from 'react-redux'
import type { RootState } from '../redux/store'
import { useAppDispatch } from './useRedux'
import {
  fetchBanks,
  fetchServicesForBank,
  fetchCommonFormConfig,
  fetchFormConfig,
  submitServiceRequest,
  updateServiceRequest,
  fetchMyServiceRequests,
  generatePDF,
  searchCustomers,
  setStep,
  selectBank,
  toggleService,
  clearSelectedServices,
  selectCustomer,
  clearCustomerSearch,
  resetForm,
  clearError,
  type SelectedService,
  type CustomerSearchResult,
} from '../redux/slices/serviceRequestSlice'

export const useServiceRequest = () => {
  const dispatch = useAppDispatch()
  const state = useSelector((state: RootState) => state.serviceRequest)

  return {
    ...state,

    loadBanks: () => dispatch(fetchBanks()),
    loadServices: (bankId: number) => dispatch(fetchServicesForBank(bankId)),
    loadCommonForm: (bankId: number) => dispatch(fetchCommonFormConfig(bankId)),
    loadForm: (bankServiceId: number) => dispatch(fetchFormConfig(bankServiceId)),
    submitRequest: (data: { bankId: number; customerId?: number; requestData: Record<string, any> }) =>
      dispatch(submitServiceRequest(data)).unwrap(),
    updateRequest: (data: { id: string; requestData: Record<string, any> }) =>
      dispatch(updateServiceRequest(data)).unwrap(),
    loadRequests: (params?: { status?: string }) => dispatch(fetchMyServiceRequests(params ?? {})),
    generatePdf: (requestId: string) => dispatch(generatePDF(requestId)).unwrap(),
    searchCust: (query: string) => dispatch(searchCustomers(query)),
    goToStep: (step: 'bank' | 'service' | 'customer' | 'form' | 'done') => dispatch(setStep(step)),
    pickBank: (bankId: number) => dispatch(selectBank(bankId)),
    toggleSvc: (svc: SelectedService) => dispatch(toggleService(svc)),
    clearSvc: () => dispatch(clearSelectedServices()),
    pickCustomer: (customer: CustomerSearchResult | null) => dispatch(selectCustomer(customer)),
    clearCustSearch: () => dispatch(clearCustomerSearch()),
    reset: () => dispatch(resetForm()),
    clearError: () => dispatch(clearError()),
  }
}
