type SortableField = 'make' | 'startingBid' | 'mileage' | 'auctionDateTime';

interface SortOption {
  label: string;
  value: {
    field: SortableField;
    direction: 'asc' | 'desc';
  };
}
