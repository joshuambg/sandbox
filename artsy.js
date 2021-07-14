
const request = require('request-promise-native');
const readline = require('readline');
const path = require('path');
const {sequencePromises } = require('./helpers/sequence-promises')
const urlparser = require('url');
const { JSDOM } = require("jsdom");
const fs = require("fs");
const linkscrape = require('linkscrape');
const isReachable = require('is-reachable');

let cursor = '';
let run = 0;
const count = 1000;
const art = []

function getArt() {
	request("https://metaphysics-production.artsy.net/v2", {
	  "headers": {
	    "accept": "*/*",
	    "accept-language": "en-US,en;q=0.9",
	    "content-type": "application/json",
	    "sec-fetch-dest": "empty",
	    "sec-fetch-mode": "cors",
	    "sec-fetch-site": "same-site",
	    "x-access-token": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI1ZjQyODU2YjRjNjJkMzAwMGRlODIxMTAiLCJzYWx0X2hhc2giOiJmY2I3ODFkYTQzMDNlMDM4NTc1ZWU2NzE4ZDMyYmY5NiIsInJvbGVzIjoidXNlciIsInBhcnRuZXJfaWRzIjpbXSwib3RwIjpmYWxzZSwiZXhwIjoxNjEwNTg0NjcwLCJpYXQiOjE2MDU0MDA2NzEsImF1ZCI6IjVkNDA5OTZlNmU2MDQ5MDAwNzQ5MGZhMiIsImlzcyI6IkdyYXZpdHkiLCJqdGkiOiI1ZmIwNzg1ZmZjMmM3MjAwMGVhMGI0MjgifQ.N39dedfAURunXvyq0BjrbxjBscbtDaqF4so5i3194Jo",
	    "x-timezone": "America/Los_Angeles",
	    "x-user-id": "5f42856b4c62d3000de82110"
	  },
	  "referrer": "https://www.artsy.net/",
	  "referrerPolicy": "strict-origin-when-cross-origin",
	  "body": "{\"id\":\"GeneArtworksPaginationQuery\",\"query\":\"query GeneArtworksPaginationQuery(\\n  $geneID: String!\\n  $count: Int!\\n  $cursor: String\\n  $sort: String\\n  $priceRange: String\\n  $dimensionRange: String\\n  $medium: String\\n  $forSale: Boolean\\n) {\\n  gene(id: $geneID) {\\n    ...GeneArtworks_gene_1QTmdc\\n    id\\n  }\\n}\\n\\nfragment ArtworkGrid_artworks on ArtworkConnectionInterface {\\n  edges {\\n    __typename\\n    node {\\n      id\\n      slug\\n      href\\n      internalID\\n      image {\\n        aspect_ratio: aspectRatio\\n      }\\n      ...GridItem_artwork\\n    }\\n    ... on Node {\\n      id\\n    }\\n  }\\n}\\n\\nfragment Badge_artwork on Artwork {\\n  is_biddable: isBiddable\\n  href\\n  sale {\\n    is_preview: isPreview\\n    display_timely_at: displayTimelyAt\\n    id\\n  }\\n}\\n\\nfragment Contact_artwork on Artwork {\\n  href\\n  is_inquireable: isInquireable\\n  sale {\\n    is_auction: isAuction\\n    is_live_open: isLiveOpen\\n    is_open: isOpen\\n    is_closed: isClosed\\n    id\\n  }\\n  partner(shallow: true) {\\n    type\\n    id\\n  }\\n  sale_artwork: saleArtwork {\\n    highest_bid: highestBid {\\n      display\\n    }\\n    opening_bid: openingBid {\\n      display\\n    }\\n    counts {\\n      bidder_positions: bidderPositions\\n    }\\n    id\\n  }\\n}\\n\\nfragment Details_artwork on Artwork {\\n  href\\n  title\\n  date\\n  sale_message: saleMessage\\n  cultural_maker: culturalMaker\\n  artists(shallow: true) {\\n    id\\n    href\\n    name\\n  }\\n  collecting_institution: collectingInstitution\\n  partner(shallow: true) {\\n    name\\n    href\\n    id\\n  }\\n  sale {\\n    is_auction: isAuction\\n    is_closed: isClosed\\n    id\\n  }\\n  sale_artwork: saleArtwork {\\n    counts {\\n      bidder_positions: bidderPositions\\n    }\\n    highest_bid: highestBid {\\n      display\\n    }\\n    opening_bid: openingBid {\\n      display\\n    }\\n    id\\n  }\\n}\\n\\nfragment Dropdown_aggregation on ArtworksAggregationResults {\\n  slice\\n  counts {\\n    name\\n    value\\n    count\\n  }\\n}\\n\\nfragment GeneArtworks_gene_1QTmdc on Gene {\\n  slug\\n  filtered_artworks: filterArtworksConnection(aggregations: [MEDIUM, TOTAL, PRICE_RANGE, DIMENSION_RANGE], forSale: $forSale, medium: $medium, priceRange: $priceRange, dimensionRange: $dimensionRange, includeMediumFilterInAggregation: true, first: $count, after: $cursor, sort: $sort) {\\n    ...TotalCount_filter_artworks\\n    aggregations {\\n      slice\\n      counts {\\n        name\\n        value\\n      }\\n      ...Dropdown_aggregation\\n    }\\n    id\\n    pageInfo {\\n      hasNextPage\\n      endCursor\\n    }\\n    ...ArtworkGrid_artworks\\n    edges {\\n      node {\\n        id\\n        __typename\\n      }\\n      cursor\\n    }\\n    facet {\\n      __typename\\n      ...Headline_facet\\n      ... on Node {\\n        id\\n      }\\n    }\\n  }\\n}\\n\\nfragment GridItem_artwork on Artwork {\\n  internalID\\n  title\\n  image_title: imageTitle\\n  image {\\n    placeholder\\n    url(version: \\\"large\\\")\\n    aspect_ratio: aspectRatio\\n  }\\n  href\\n  ...Metadata_artwork\\n  ...Save_artwork\\n  ...Badge_artwork\\n}\\n\\nfragment Headline_facet on ArtworkFilterFacet {\\n  ... on Tag {\\n    name\\n  }\\n  ... on Gene {\\n    name\\n  }\\n}\\n\\nfragment Metadata_artwork on Artwork {\\n  ...Details_artwork\\n  ...Contact_artwork\\n  href\\n}\\n\\nfragment Save_artwork on Artwork {\\n  id\\n  internalID\\n  slug\\n  is_saved: isSaved\\n  title\\n}\\n\\nfragment TotalCount_filter_artworks on FilterArtworksConnection {\\n  counts {\\n    total\\n  }\\n}\\n\",\"variables\":{\"geneID\":\"painting\",\"count\":"+count+",\"cursor\":\""+cursor+"\",\"sort\":\"-partner_updated_at\",\"priceRange\":\"*\",\"dimensionRange\":\"*\",\"medium\":\"*\",\"forSale\":true}}",
	  "method": "POST",
	  "mode": "cors"
	}).then(json1=>JSON.parse(json1)).then((json) => {
		if (!(json && json["data"] && json["data"]["gene"] && json["data"]["gene"]["filtered_artworks"] && json["data"]["gene"]["filtered_artworks"]["pageInfo"] && json["data"]["gene"]["filtered_artworks"]["counts"] && json["data"]["gene"]["filtered_artworks"]["counts"]["total"])){ console.log(json["data"]); setTimeout(getArt, 5000); return; }
		console.log(json["data"]["gene"]["filtered_artworks"]["counts"]["total"]-(count*run++))
		art.splice(0,0,...json["data"]["gene"]["filtered_artworks"]["edges"])
		cursor = json["data"]["gene"]["filtered_artworks"]["pageInfo"]["endCursor"];
		if(json["data"]["gene"]["filtered_artworks"]["pageInfo"]["hasNextPage"])
		{
			getArt();
		} else {
			fs.writeFileSync('./paintings.json',JSON.stringify(art),'utf8')
		}
	})

}
getArt();

// sequencePromises(allScraped, (scraped) => isReachable(scraped.link, { timeout: 60000 }), 0)
// .then(results => {
//   console.log(uniq(allScraped.filter((scraped, index) => results.flat()[index]).map(scraped=>scraped.link)).join("\n"));
// })
