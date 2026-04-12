# Product Backlog: Gas Price Viewer

## User Stories

### Story 1
As a driver, I want to view today’s gas prices near me so that I can avoid paying the highest station rates.

- Priority: High
- Story points: 3
- Acceptance criteria:
- I can search by city or ZIP code.
- I can see a list of nearby stations with price per fuel type.
- Data shows last updated time for each station.

### Story 2
As a commuter, I want to compare regular, midgrade, and premium prices so that I can choose the most affordable option for my vehicle.

- Priority: High
- Story points: 5
- Acceptance criteria:
- I can filter station results by fuel type.
- I can sort by lowest to highest price.
- The selected fuel type is preserved when I change location.

### Story 3
As a budget-conscious family member, I want to see a 7-day and 30-day trend so that I can plan filling up before expected spikes from world events.

- Priority: High
- Story points: 5
- Acceptance criteria:
- I can view daily average prices for selected time ranges.
- I can switch between chart ranges without losing location context.
- The trend view highlights upward price momentum.

### Story 4
As a user, I want alerts for sharp gas price increases so that I can buy fuel before prices rise further.

- Priority: High
- Story points: 8
- Acceptance criteria:
- I can set a threshold alert by location and fuel type.
- I receive an alert when price change exceeds my threshold.
- I can manage and disable alerts from my profile.

### Story 5
As a user, I want a map of station prices so that I can choose the cheapest station along my route.

- Priority: High
- Story points: 8
- Acceptance criteria:
- I can view nearby stations on a map with price markers.
- Marker colors reflect low, medium, and high price bands.
- Selecting a marker shows station details and update timestamp.

### Story 6
As a user, I want a world events feed tied to price changes so that I can understand why gas prices are high.

- Priority: High
- Story points: 8
- Acceptance criteria:
- I can view major events (conflicts, sanctions, supply cuts, refinery outages).
- Each event includes source, date, and estimated market impact.
- Relevant events are linked to local price trend periods.

### Story 7
As a fleet manager, I want regional price heatmaps so that I can route vehicles through lower-cost fueling zones.

- Priority: Med
- Story points: 5
- Acceptance criteria:
- I can compare average prices across regions on one screen.
- I can filter heatmap by fuel type and date.
- I can export selected region snapshots as CSV.

### Story 8
As a user, I want to save favorite stations so that I can quickly track locations where prices are usually lowest.

- Priority: Med
- Story points: 3
- Acceptance criteria:
- I can add and remove favorite stations.
- I can view price deltas for favorites since last check.
- Favorites sync across sessions for my account.

### Story 9
As an analyst, I want to export gas price datasets so that I can produce reports on inflation pressure from fuel costs.

- Priority: Low
- Story points: 3
- Acceptance criteria:
- I can export filtered price data in CSV format.
- Export includes station, location, fuel type, and timestamp.
- Export reflects the same filters as the dashboard.

### Story 10
As a user, I want low-data mode so that I can still access key price information on unstable mobile connections.

- Priority: Low
- Story points: 2
- Acceptance criteria:
- The app loads a compact station list with minimal assets.
- Charts can be disabled while retaining essential price data.
- The app clearly indicates when data is stale.

### Story 11 (Change Request)
As a policy watcher, I want event impact tags on price spikes so that I can distinguish geopolitical causes from local supply issues.

- Priority: High
- Story points: 5
- Acceptance criteria:
- Price spikes can be tagged as geopolitical, refinery, weather, tax, or logistics.
- Tagging includes confidence level and source citation.
- Users can filter trends by impact tag.

## Change Request Simulation

- New requirement added: event impact tagging for gas price spikes.
- Backlog impact: Story 11 added as High priority.
- Sprint impact: Story 11 is pulled into Sprint 1 and one story is moved out to protect capacity.
