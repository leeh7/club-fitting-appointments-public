import { ListGroup } from 'react-bootstrap'
import { Provider } from '../types'

interface ProviderListProps {
  providers: Provider[]
  onSelectProvider: (provider: Provider) => void
  selectedProvider: Provider | null
}

function ProviderList({
  providers,
  onSelectProvider,
  selectedProvider,
}: ProviderListProps) {
  return (
    <div>
      <h2>Select a Provider</h2>
      <ListGroup>
        {providers.map((provider) => (
          <ListGroup.Item
            key={provider.id}
            action
            onClick={() => onSelectProvider(provider)}
            active={selectedProvider?.id === provider.id}
          >
            {provider.name}
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  )
}

export default ProviderList
