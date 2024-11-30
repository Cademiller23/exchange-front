import React from "react";
import { Card, CardHeader, CardFooter, Image, Button } from "@nextui-org/react";

const EventCard = ({ event }) => {
  return (
    <Card isFooterBlurred className="w-[80%] h-[300px] m-4">
      {/* Card Header */}
      <CardHeader className="absolute z-10 top-1 flex-col items-start">
        <p className="text-tiny text-white/60 uppercase font-bold">{event.subtitle}</p>
        <h4 className="text-white font-medium text-xl">{event.title}</h4>
      </CardHeader>

      {/* Card Image */}
      <Image
        removeWrapper
        alt={event.title}
        className="z-0 w-full h-full object-cover"
        src={event.image}
      />

      {/* Card Footer */}
      <CardFooter className="absolute bg-black/40 bottom-0 border-t-1 border-default-600 dark:border-default-100 z-10 justify-between">
        <div>
          <p className="text-tiny text-white">Upcoming: {event.date}</p>
          <p className="text-tiny text-white">{event.location}</p>
        </div>
        <Button color="primary" radius="full" size="sm">
          Learn More
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EventCard;