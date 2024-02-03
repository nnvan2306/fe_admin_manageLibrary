import { useEffect, useState } from "react";
import { HandleApi } from "../services/handleApi";

const usePagination = ({
    api,
    page,
    pageSize,
    isToken = false,
    is_load_more = false,
    is_reload = false,
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState([]);
    const [meta, setMeta] = useState(null);
    const [pagination, setPagination] = useState({
        page,
        pageSize,
    });

    useEffect(() => {
        const _fetch = async () => {
            let Res;
            try {
                setIsLoading(true);
                if (isToken) {
                    Res = await HandleApi(api, {
                        page: pagination.page,
                        pageSize: pagination.pageSize,
                    });
                } else {
                    Res = await api({
                        page: pagination.page,
                        pageSize: pagination.pageSize,
                    });
                }

                if (Res) {
                    if (is_load_more) {
                        setData((prev) => [...prev, ...Res.items]);
                    } else {
                        setData(Res.items);
                    }
                    setMeta(Res.meta);
                }
            } catch (error) {
                console.log(error);
            }
            setIsLoading(false);
        };
        _fetch();
    }, [
        api,
        isToken,
        is_load_more,
        pagination.page,
        pagination.pageSize,
        is_reload,
    ]);

    const handleChangePage = (page) => {
        if (meta) {
            if (page >= 0 && page <= meta.totalPages) {
                setPagination((prev) => ({
                    ...prev,
                    page: page,
                }));
            }
        }
    };

    return {
        isLoading,
        data,
        meta,
        handleChangePage,
    };
};

export default usePagination;
