import "./App.css";
import {
  Button,
  Card,
  FormLayout,
  Frame,
  Layout,
  Link,
  Loading,
  Page,
  Select,
  SkeletonBodyText,
  TextContainer,
  TextField,
} from "@shopify/polaris";
import { useEffect, useState } from "react";
const headers = {
  accept: "application/json",
  "Content-Type": "application/json",
  appTag: "amazon_sales_channel",
  authorization: `eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJ1c2VyX2lkIjoiNjMzMjlkN2YwNDUxYzA3NGFhMGUxNWE4Iiwicm9sZSI6ImN1c3RvbWVyIiwiZXhwIjoxNjY0OTg4NjM3LCJpc3MiOiJodHRwczpcL1wvYXBwcy5jZWRjb21tZXJjZS5jb20iLCJ0b2tlbl9pZCI6IjYzM2Q3ZDlkYjgyM2I5MTVhMzc0NTA3NSJ9.eZKlcA00P9R_hw-ThPqMP1G_ntdht2hoh2Sx9FhfFXsw1725An17BDLLEA5GYGEXr-vtrUMoWq2E7_sRAkFvvbBrEljQenYRUH0VxIdgFvUk3ptoh9_x63ZhOpS2LhW0v5G16fZiY4StoArQZ3TVRrzqf9b5ZGVrlxh7RjR6oZEzLg6UHqPdYXn5o1J0FdoyCndaDo8y3XwNBPUJU1BqnVMxeYYFnYlxWCpH1jq8IjSrP1YSQARMZhAfqrxuN73utQMwf5EYR4_2fM8Iz-LiwN7wVkRkoj7hDTeQtVx_736tycu6f4lLf03CZ0mxzrbAXuifl3eJsHKso0lgL4UxPg`,
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
};

function App() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [options, setOptions] = useState([]);
  const [selectedCategory, setselecetedCategory] = useState([]);
  const [selectRow, setSelectRow] = useState([]);
  const [addattributesDisplay, setAttributesDisplay] = useState(false);
  const [attributeOptions, showAttributeOptions] = useState(false);
  const [attributeOptionsArray, setattributeOptionsArray] = useState([]);
  const [selectedAttributeRow, setselectedAttributeRow] = useState([]);
  const [selectedAttributeArray, setselectedAttributeArray] = useState([]);
  const [payload, setPayload] = useState({
    target_marketplace: "eyJtYXJrZXRwbGFjZSI6ImFsbCIsInNob3BfaWQiOm51bGx9",
    selected: [],
    target: {
      marketplace: "amazon",
      shopId: "530",
    },
  });

  const handleOptionsChange = (e, i) => {
    selectedCategory[i] = e;
    setselecetedCategory([...selectedCategory]);
    let tempPayload = { ...payload };
    console.log(data);
    data.map((it, i) => {
      if (it.name === e) {
        if (it.hasChildren) {
          tempPayload.selected = it.parent_id;
          setPayload(tempPayload);
        } else {
          payloadAttribute.data.category = it.category["primary-category"];
          payloadAttribute.data.sub_category = it.category["sub-category"];
          categoryfetchhandler();
        }
      }
    });
  };
  const attributeChangeHandler = (e) => {
    // alert(e);
    setselectedAttributeRow([...selectedAttributeRow, 1]);
    selectedAttributeArray.push([{ label: e, value: e }]);
    setselectedAttributeArray([...selectedAttributeArray]);
    showAttributeOptions(false);
    attributeOptionsArray.map((it, i) => {
      if (it.value === e) {
        it["disabled"] = true;
      }
    });
  };
  const deleteHandler = (e, i, val) => {
    e.preventDefault();
    selectedAttributeArray.splice(i, 1);
    setselectedAttributeArray([...selectedAttributeArray]);
    selectedAttributeRow.splice(i, 1);
    setselectedAttributeRow([...selectedAttributeRow]);
    attributeOptionsArray.map((it, j) => {
      if (it.label === val) {
        it["disabled"] = false;
      }
    });
  };
  const fetchhandler = (e) => {
    setLoading(true);
    var url =
      "https://multi-account.sellernext.com/home/public/connector/profile/getAllCategory/";
    // console.log(url);
    fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((fetchedData) => {
        // console.log(fetchedData);
        setLoading(false);
        setData(fetchedData.data);
        let nextOptions = [];
        fetchedData.data.map((it, i) => {
          nextOptions.push({ label: it.name, value: it.name });
        });
        options.push(nextOptions);
        setOptions([...options]);
        setSelectRow([...selectRow, 1]);
      });
  };
  useEffect(() => {
    fetchhandler();
  }, [payload]);

  const categoryfetchhandler = () => {
    setAttributesDisplay(true);
    setLoading(true);
    var url =
      "https://multi-account.sellernext.com/home/public/connector/profile/getCategoryAttributes/";
    fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(payloadAttribute),
    })
      .then((res) => res.json())
      .then((fetchedData) => {
        console.log(fetchedData.data);
        setLoading(false);

        let nextOptions = [];
        var duplicateKeys = {};
        for (let i in fetchedData.data) {
          for (let j in fetchedData.data[i]) {
            console.log(i, j);
            if (!duplicateKeys[fetchedData.data[i][j]["label"]]) {
              nextOptions.push({
                label: fetchedData.data[i][j]["label"],
                value: fetchedData.data[i][j]["label"],
              });
              duplicateKeys[fetchedData.data[i][j]["label"]] = 1;
            }
          }
        }
        console.log(nextOptions.length);

        setattributeOptionsArray(nextOptions);
      });
  };
  return (
    <div className="App">
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
                  <Card sectioned>
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
                {selectedAttributeRow.length > 0 && (
                  <Card sectioned>
                    {selectedAttributeRow.map((it, i) => (
                      <Card sectioned key={selectedAttributeArray[i][0]}>
                        {" "}
                        <Link
                          url="#"
                          onClick={(e) =>
                            deleteHandler(
                              e,
                              i,
                              selectedAttributeArray[i][0]["label"]
                            )
                          }
                        >
                          Delete
                        </Link>
                        <Select
                          options={selectedAttributeArray[i]}
                          label="Amazon Attribute"
                        />
                        <br />
                        <TextField placeholder="shopify_attribute" />
                      </Card>
                    ))}
                  </Card>
                )}

                {attributeOptions && (
                  <Card title="Amazon attributes">
                    <Select
                      options={attributeOptionsArray}
                      onChange={(e) => attributeChangeHandler(e)}
                      placeholder="Select an Attribute"
                    />
                  </Card>
                )}
                {addattributesDisplay && (
                  <Card title="Optional Attributes" sectioned>
                    <Button
                      primary
                      onClick={() => showAttributeOptions(true)}
                      disabled={attributeOptions}
                    >
                      Add Attributes
                    </Button>
                  </Card>
                )}
              </FormLayout>
            </Card>
          </Layout.AnnotatedSection>
        </Layout>
      </Page>
    </div>
  );
}

export default App;
