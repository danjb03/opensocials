
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SelectedCreatorsBar } from './SelectedCreatorsBar';
import { CreatorGrid } from './CreatorGrid';
import { CreatorList } from './CreatorList';
import { Creator } from '@/types/creator';

interface CreatorSearchResultsProps {
  searchHookData: any;
  transformedCreators: Creator[];
  transformedSelectedCreators: Creator[];
  campaignsForBar: Array<{id: string, title: string}>;
  selectedCreatorIds: number[];
  viewMode: 'grid' | 'list';
  handlers: {
    handleCreatorToggle: (creatorId: number) => void;
    handleViewProfile: (creatorId: number) => void;
    handleFavoriteToggle: (creatorId: number) => void;
  };
}

export const CreatorSearchResults = ({
  searchHookData,
  transformedCreators,
  transformedSelectedCreators,
  campaignsForBar,
  selectedCreatorIds,
  viewMode,
  handlers
}: CreatorSearchResultsProps) => {
  const { isLoading, addCreatorsToProject, selectedCampaignId, setSelectedCampaignId, resetFilters } = searchHookData;

  return (
    <>
      {transformedSelectedCreators.length > 0 && (
        <div className="mb-8 animate-fade-in">
          <SelectedCreatorsBar 
            selectedCreators={selectedCreatorIds} 
            availableCampaigns={campaignsForBar} 
            selectedCampaignId={selectedCampaignId} 
            onSelectCampaign={setSelectedCampaignId} 
            onAddToCart={addCreatorsToProject} 
          />
        </div>
      )}
      
      <div className="relative min-h-[300px]">
        {isLoading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : transformedCreators.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="text-center py-16">
              <svg className="mx-auto h-12 w-12 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-foreground">No creators found</h3>
              <p className="mt-1 text-sm text-foreground">Try adjusting your search or filter criteria.</p>
              <div className="mt-6">
                <Button onClick={resetFilters} variant="outline" className="text-foreground">
                  Clear all filters
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : viewMode === 'grid' ? (
          <CreatorGrid 
            creators={transformedCreators} 
            selectedCreators={selectedCreatorIds} 
            onToggleCreator={handlers.handleCreatorToggle}
            onViewProfile={handlers.handleViewProfile} 
          />
        ) : (
          <CreatorList 
            creators={transformedCreators} 
            selectedCreators={selectedCreatorIds} 
            onToggleCreator={handlers.handleCreatorToggle}
            onViewProfile={handlers.handleViewProfile} 
          />
        )}
      </div>
    </>
  );
};
