# Changelog

All notable changes to this project will be documented in this file.

## [1.1.0] - 2025-10-31

### Added
- Interactive "Show original" button for on-demand display of original URLs
- Button-based UI for cleaner initial message presentation

### Changed
- Bot now initially shows only the embed URL with a "Show original" button
- Bot now pings the original message author instead of just displaying their username
- Original URL is now displayed on-demand via button interaction
- Button disappears after being clicked to prevent spam

### Technical Details
- Implemented Discord.js ActionRowBuilder and ButtonBuilder components
- Added button interaction handling in interactionCreate event
- Enhanced message storage to preserve original content for button callbacks
- Updated interaction handler to support both slash commands and button interactions
- Button uses unique custom ID with author ID and timestamp for tracking

## [1.0.0] - Initial Release

### Added
- Basic Instagram URL embedding functionality
- Automatic replacement of `www.instagram.com` with configurable embed prefix
- Message deletion of original Instagram links
- Error handling for message processing and deletion