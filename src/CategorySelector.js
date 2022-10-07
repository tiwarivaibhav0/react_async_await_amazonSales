import {
  Card,
  FormLayout,
  Frame,
  Layout,
  Loading,
  Page,
  Select,
  SkeletonBodyText,
  TextContainer,
} from "@shopify/polaris";
import { createContext, useEffect, useState } from "react";
import AttributeSelector from "./AttributeSelector";
export const Contxt = createContext();

const headers = {
  accept: "application/json",
  "Content-Type": "application/json",
  appTag: "amazon_sales_channel",
  authorization: `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJ1c2VyX2lkIjoiNjI5MGRiYjIzOGUyOWExYjIzMzYwY2E5Iiwicm9sZSI6ImFkbWluIiwiZXhwIjoxNjk2NTY4MDE3LCJpc3MiOiJodHRwczpcL1wvYXBwcy5jZWRjb21tZXJjZS5jb20iLCJ0b2tlbl9pZCI6IjYzM2U1ZjUxYWRkZGFlMjIyNjczN2E5MiJ9.m5LW1XQ_w6E8Y_ZAWV-SqoqLUpgyeQXe3R7aGKhCfkxA0h0i2oESFxS3NXvsqU2zBWO9iPa5vobjXypZCEo7ZbjieaowfryVym-Yc2Kc-SkfHJfr7a2QrXxfKql0nBX0SvgEfVdWKxmVb3AK7MyT60gVUCCh82H7ExXntXA46oTvIQkK2rMTC1pCAFxFcWPTUEvz2yfuyLf62533dDfbdWwnYBxOYXrTUBN9E6aOsbl8MDfglV7bRIiKCXF1hTRjyOzUzqp_Tns4kg3oT2zXKpv7mLFcPpEPnYveRP4TGi_N5gRjfyA4o7xAxTHIxmhlRrY7ZEFUx-BcW6aZz7tYNw`,
  "Ced-Source-Id": 500,
  "Ced-Source-Name": "shopify",
  "Ced-Target-Id": 530,
  "Ced-Target-Name": "amazon",
};
var payloadAttribute = {
  target_marketplace: "eyJtYXJrZXRwbGFjZSI6ImFsbCIsInNob3BfaWQiOm51bGx9",
  target: {
    marketplace: "amazon",
    shopId: "530",
  },
  source: {
    marketplace: "shopify",
    shopId: "500",
  },
  data: {
    barcode_exemption: false,
    browser_node_id: "1380072031",
    category: "",
    sub_category: "",
  },
  user_id: "63329d7f0451c074aa0e15a8",
};

function CategorySelector() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [options, setOptions] = useState([]);
  const [selectedCategory, setselecetedCategory] = useState([]);
  const [selectRow, setSelectRow] = useState([]);
  const [attributeOptionsArray, setattributeOptionsArray] = useState([]);
  const [attributeOptions, showAttributeOptions] = useState(false);
  const [selectedAttributeArray, setselectedAttributeArray] = useState([]);
  const [textInputArray, setTextInputArray] = useState([]);
  const [payload, setPayload] = useState({
    target_marketplace: "eyJtYXJrZXRwbGFjZSI6ImFsbCIsInNob3BfaWQiOm51bGx9",
    selected: [],
    user_id: "63329d7f0451c074aa0e15a8",
    target: {
      marketplace: "amazon",
      shopId: "530",
    },
  });

  const handleOptionsChange = (e, i) => {
    showAttributeOptions(false);
    setattributeOptionsArray([]);
    setselectedAttributeArray([]);
    if (selectRow.length - 1 === i) {
      selectedCategory[i] = e;
      setselecetedCategory([...selectedCategory]);
      data[i].map((it, j) => {
        if (it.name === e) {
          if (it.hasChildren) {
            payload.selected = it.parent_id;
            setPayload({ ...payload });
          } else {
            payloadAttribute.data.category = it.category["primary-category"];
            payloadAttribute.data.sub_category = it.category["sub-category"];
            categoryfetchhandler();
          }
        }
        return 0;
      });
    } else {
      selectedCategory[i] = e;
      selectedCategory.splice(i + 1);

      setselecetedCategory([...selectedCategory]);
      selectRow.splice(i + 1);
      setSelectRow([...selectRow]);
      let tempData = [...data];
      tempData.splice(i + 1);
      setData(tempData);
      let tempOpt = [...options];
      tempOpt.splice(i + 1);
      setOptions(tempOpt);

      data[i].map((it, j) => {
        if (it.name === e) {
          if (it.hasChildren) {
            payload.selected = it.parent_id;
            setPayload({ ...payload });
          } else {
            payloadAttribute.data.category = it.category["primary-category"];
            payloadAttribute.data.sub_category = it.category["sub-category"];
            categoryfetchhandler();
          }
        }
        return 0;
      });
    }
  };

  const fetchhandler = async (e) => {
    setLoading(true);
    var url =
      "https://multi-account.sellernext.com/home/public/connector/profile/getAllCategory/";
    var res = await fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(payload),
    });
    var fetchedData = await res.json();
    // console.log(fetchedData);
    let tempData = [...data];
    tempData.push(fetchedData.data);

    setData(tempData);
    setLoading(false);
    showAttributeOptions(false);

    let nextOptions = [];
    fetchedData.data.map((it, i) => {
      nextOptions.push({ label: it.name, value: it.name });
      return 0;
    });
    let tempOptions = [...options];
    tempOptions.push(nextOptions);
    setOptions(tempOptions);
    // console.log(tempOptions);
    setSelectRow([...selectRow, 1]);
    // console.log(selectRow);
  };
  useEffect(() => {
    // alert("");
    fetchhandler();
  }, [payload]);

  const categoryfetchhandler = async () => {
    setLoading(true);
    var url =
      "https://multi-account.sellernext.com/home/public/connector/profile/getCategoryAttributes/";
    var res = await fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(payloadAttribute),
    });
    var fetchedData = await res.json();
    // console.log(fetchedData.data);
    setLoading(false);

    let nextOptions = [];
    var duplicateKeys = {};
    for (let i in fetchedData.data) {
      for (let j in fetchedData.data[i]) {
        // console.log(i, j);
        if (!duplicateKeys[fetchedData.data[i][j]["label"]]) {
          nextOptions.push({
            label: fetchedData.data[i][j]["label"],
            value: fetchedData.data[i][j]["label"],
          });
          duplicateKeys[fetchedData.data[i][j]["label"]] = 1;
        }
      }
    }
    // console.log(nextOptions.length);

    setattributeOptionsArray(nextOptions);
  };
  return (
    <div>
      <Page fullWidth>
        <Layout>
          <Layout.AnnotatedSection
            id="storeDetails"
            title="Amazon Sales Channel"
            description="Add attributes to your listed Products."
          >
            <Card sectioned>
              <FormLayout>
                {selectRow.map((it, i) => (
                  <Card sectioned key={i}>
                    {" "}
                    <Select
                      options={options[i]}
                      onChange={(e) => handleOptionsChange(e, i)}
                      value={selectedCategory[i]}
                      placeholder="Select Category"
                    />
                  </Card>
                ))}
                {loading && (
                  <Frame>
                    <Card sectioned>
                      <Loading />
                      <Card sectioned>
                        <TextContainer>
                          <SkeletonBodyText />
                        </TextContainer>
                      </Card>
                    </Card>
                  </Frame>
                )}
                <Contxt.Provider
                  value={[
                    attributeOptionsArray,
                    attributeOptions,
                    showAttributeOptions,
                    selectedAttributeArray,
                    setselectedAttributeArray,
                    textInputArray,
                    setTextInputArray,
                  ]}
                >
                  <AttributeSelector />
                </Contxt.Provider>
              </FormLayout>
            </Card>
          </Layout.AnnotatedSection>
        </Layout>
      </Page>
    </div>
  );
}

export default CategorySelector;
