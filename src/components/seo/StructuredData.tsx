import { FC } from 'react';
import { Helmet } from 'react-helmet-async';

interface OrganizationSchemaProps {
  name?: string;
  url?: string;
  logo?: string;
}

export const OrganizationSchema: FC<OrganizationSchemaProps> = ({
  name = "Cudowna Doniczka - Fundacja EWC",
  url = "https://cudowna-doniczka.com",
  logo = "https://cudowna-doniczka.com/logo.png"
}) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": name,
    "url": url,
    "logo": logo,
    "description": "Rewolucyjne doniczki z Mineralnego Kompozytu Konopnego, które pochłaniają CO₂. Wspieramy Fundację EWC.",
    "foundingDate": "2024",
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "Customer Service",
      "availableLanguage": "Polish"
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
};

interface ProductSchemaProps {
  name: string;
  description: string;
  image?: string;
}

export const ProductSchema: FC<ProductSchemaProps> = ({
  name,
  description,
  image = "https://cudowna-doniczka.com/images/product.jpg"
}) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": name,
    "description": description,
    "image": image,
    "brand": {
      "@type": "Brand",
      "name": "Cudowna Doniczka"
    },
    "material": "Mineralny Kompozyt Konopny",
    "sustainability": {
      "@type": "PropertyValue",
      "name": "CO2 Absorption",
      "value": "Naturalny filtr dwutlenku węgla"
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
};

interface ArticleSchemaProps {
  title: string;
  description: string;
  author: string;
  datePublished: string;
  image?: string;
  url?: string;
}

export const ArticleSchema: FC<ArticleSchemaProps> = ({
  title,
  description,
  author,
  datePublished,
  image = "https://cudowna-doniczka.com/images/article.jpg",
  url = window.location.href
}) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": title,
    "description": description,
    "author": {
      "@type": "Person",
      "name": author
    },
    "datePublished": datePublished,
    "image": image,
    "publisher": {
      "@type": "Organization",
      "name": "Cudowna Doniczka - Fundacja EWC",
      "logo": {
        "@type": "ImageObject",
        "url": "https://cudowna-doniczka.com/logo.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": url
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
};

interface EventSchemaProps {
  name: string;
  description: string;
  startDate: string;
  location?: string;
  image?: string;
}

export const EventSchema: FC<EventSchemaProps> = ({
  name,
  description,
  startDate,
  location = "Online / Do ustalenia",
  image = "https://cudowna-doniczka.com/images/event.jpg"
}) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Event",
    "name": name,
    "description": description,
    "startDate": startDate,
    "image": image,
    "location": {
      "@type": "Place",
      "name": location
    },
    "organizer": {
      "@type": "Organization",
      "name": "Fundacja EWC",
      "url": "https://cudowna-doniczka.com"
    },
    "eventStatus": "https://schema.org/EventScheduled",
    "eventAttendanceMode": "https://schema.org/MixedEventAttendanceMode"
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
};
