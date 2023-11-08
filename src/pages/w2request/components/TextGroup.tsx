import { W2REQUEST_API } from "api/baseApi";
import { IOffices } from "interfaces/office";
import { useCustom } from "@pankod/refine-core";

interface ITextGroup {
    label: string;
    content?: string | number | null | undefined;
}
export const TextGroup = ({ label, content }: ITextGroup) => {
    const { data: offices } = useCustom<IOffices[]>({
        url: W2REQUEST_API + "/list-offices",
        method: "get",
        successNotification: false,
        errorNotification: false,
    });

    const currentOffice = offices?.data?.find((office) => office.code === content)?.displayName;

    return (
        <div style={{ fontSize: "15px" }}>
            <label style={{ fontWeight: "700" }}>{label}</label>
            <p>{currentOffice ? currentOffice : content}</p>
        </div>
    )
}