import { Button } from "@pankod/refine-antd";

interface BadgeButtonTotalItemProps {
    active: boolean;
    handleSelectFilter: (name: any) => void
    name: string;
    total: number;
}

export const BadgeButtonTotalItem = (props: BadgeButtonTotalItemProps) => {
    const { active, handleSelectFilter, name, total } = props;
    return (
        <Button
            className="total-sum-assets"
            type={active ? "primary" : "ghost"}
            onClick={() => handleSelectFilter(name)}
        >
            {name} {"(" + total + ")"}
        </Button>
    )
}