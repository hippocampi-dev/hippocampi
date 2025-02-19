interface TitleCardProps {
    name: string;
}

export default function TitleCard({name = "hi"}: TitleCardProps) {
    return (
        <div className="mb-8">
            <h1 className="text-4xl font-bold">Welcome, {name}</h1>
            <p className="text-xl text-muted-foreground">Your next appointment is on Monday, 15th May at 10:00 AM</p>
        </div>
    )
}