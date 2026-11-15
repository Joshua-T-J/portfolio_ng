import { PortfolioContent } from './portfolio.models';

/**
 * Where portfolio content comes from. Components and stores depend on this
 * abstraction, never on Contentful or on a JSON file (Dependency Inversion).
 */
export abstract class ContentSource {
  abstract readonly content: PortfolioContent;
}
