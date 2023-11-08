import { TextGroup } from "./TextGroup";
import { extractContent } from "untils/extractContent";
import { useTranslate } from "@pankod/refine-core";

interface IRequestProps {
    inputRequestDetail: Record<string, Record<string, string> | string>;
}

export const RequestInput = ({ inputRequestDetail }: IRequestProps) => {
    const translate = useTranslate();
    return (
        <>
            {Object.keys(inputRequestDetail).map((key) => {
                const value = inputRequestDetail[key];
                if (!value) {
                    return null;
                }

                if (typeof value === 'object') {
                    const { displayName } = value as { displayName?: string };
                    if (displayName) {
                        return (
                            <TextGroup
                                key={key}
                                label={translate(`w2request.label.title.${key}`)}
                                content={displayName}
                            />
                        );
                    }
                } else {
                    return (
                        <TextGroup
                            key={key}
                            label={translate(`w2request.label.title.${key}`)}
                            content={extractContent(value)}
                        />
                    );
                }
            })}
        </>
    );
};