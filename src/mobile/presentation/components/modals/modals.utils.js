import PrimaryModal from '@components/modals/PrimaryModal'
import SecondaryModal from '@components/modals/SecondaryModal'

const modalsByType = {
  primary: PrimaryModal,
  secondary: SecondaryModal,
}

export const getModalByType = (type) => modalsByType[type]
