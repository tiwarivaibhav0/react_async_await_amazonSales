import logo from "./logo.svg";
import "./App.css";
import {
  Button,
  Card,
  Frame,
  Layout,
  Link,
  Loading,
  Page,
  Select,
  SkeletonBodyText,
  SkeletonDisplayText,
  SkeletonPage,
  SkeletonTabs,
  SkeletonThumbnail,
  TextContainer,
  TextField,
} from "@shopify/polaris";
import { useEffect, useState } from "react";

function App() {
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState([]);
  const [options, setOptions] = useState([]);
  const [selectedCategory, setselecetedCategory] = useState([]);
  const [selectRow, setSelectRow] = useState([]);
  const [payload, setPayload] = useState({
    target_marketplace: "eyJtYXJrZXRwbGFjZSI6ImFsbCIsInNob3BfaWQiOm51bGx9",
    selected: [],
    target: {
      marketplace: "amazon",
      shopId: "530",
    },
  });
  const [payloadAttribute, setpayloadAttribute] = useState({
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
  });
  const [addattributesDisplay, setAttributesDisplay] = useState(false);
  const [attributeOptions, showAttributeOptions] = useState(false);
  const [attributeOptionsArray, setattributeOptionsArray] = useState([]);
  const [selectedAttributeRow, setselectedAttributeRow] = useState([]);
  const [selectedAttributeArray, setselectedAttributeArray] = useState([]);
  const handleOptionsChange = (e, i) => {
    // alert(i)
    let tempSelectedCategory = [...selectedCategory];
    tempSelectedCategory[i] = e;
    setselecetedCategory(tempSelectedCategory);
    // setselecetedCategory(e);
    let tempPayload = { ...payload };
    // tempPayload.selected.push(e);
    console.log(data);
    data.map((it, i) => {
      if (it.name === e) {
        if (it.hasChildren) {
          tempPayload.selected = it.parent_id;
          setPayload(tempPayload);
        } else {
          payloadAttribute.data.category = it.category["primary-category"];
          payloadAttribute.data.sub_category = it.category["sub-category"];
          setpayloadAttribute({ ...payloadAttribute });
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
    // alert(val);
    e.preventDefault();
    let tempSelectedAttributedArray = [...selectedAttributeArray];
    tempSelectedAttributedArray.splice(i, 1);
    setselectedAttributeArray(tempSelectedAttributedArray);
    // alert(i);
    let tempRow = [...selectedAttributeRow];
    tempRow.splice(i, 1);
    setselectedAttributeRow(tempRow);
    attributeOptionsArray.map((it, j) => {
      if (it.label === val) {
        // alert();
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
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        appTag: "amazon_sales_channel",
        authorization: `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJ1c2VyX2lkIjoiNjMzMjlkN2YwNDUxYzA3NGFhMGUxNWE4Iiwicm9sZSI6ImN1c3RvbWVyIiwiZXhwIjoxNjY0OTczOTY4LCJpc3MiOiJodHRwczpcL1wvYXBwcy5jZWRjb21tZXJjZS5jb20iLCJ0b2tlbl9pZCI6IjYzM2Q0NDUwZjBiZjcwNjMzMDJiYWE4NyJ9.n289tau-BROIUnCvR_RMgh5_W0KYAkVhMZRbZcvnoXDyL7NdIxhk8SeBRDGyQp_Ug534ErQSS7ufAi3QA35EAChgsKOAxyHNnXRIEfwkF4uMI865Qa83uzFVEoS5nLG_jtC41nBY-8YnCiaHF72RqieEVMw3LRnFOoNThAtyILPM7TkvYETEjduj_9H4J01pWYck0D47tDugVIV4L_JvApOc9TKeIcpIQ9Ep2b5TjMXdVX-PWmR6p64ALBEKUiF0tVEJ7j6qZLrFfk87JKnObUlktb3Vm9gN8KuG7DxrzlF42V74zrdQAxTH5k4nwmbx2X9kaUex5DcLbuOImtmnKw`,
        "Ced-Source-Id": 500,
        "Ced-Source-Name": "shopify",
        "Ced-Target-Id": 530,
        "Ced-Target-Name": "amazon",
      },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((fetchedData) => {
        console.log(fetchedData);
        setLoading(false);
        setData(fetchedData.data);
        let nextOptions = [];
        fetchedData.data.map((it, i) => {
          nextOptions.push({ label: it.name, value: it.name });
        });
        let tempOptionArray = [...options];
        tempOptionArray.push(nextOptions);
        setOptions(tempOptionArray);
        setSelectRow([...selectRow, 1]);
      });
  };
  useEffect(() => {
    // alert("Use Effect Called");
    fetchhandler();
  }, [payload]);

  const categoryfetchhandler = () => {
    setAttributesDisplay(true);
    var url =
      "https://multi-account.sellernext.com/home/public/connector/profile/getCategoryAttributes/";
    // console.log(url);
    fetch(url, {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        appTag: "amazon_sales_channel",
        authorization: `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJ1c2VyX2lkIjoiNjMzMjlkN2YwNDUxYzA3NGFhMGUxNWE4Iiwicm9sZSI6ImN1c3RvbWVyIiwiZXhwIjoxNjY0OTczOTY4LCJpc3MiOiJodHRwczpcL1wvYXBwcy5jZWRjb21tZXJjZS5jb20iLCJ0b2tlbl9pZCI6IjYzM2Q0NDUwZjBiZjcwNjMzMDJiYWE4NyJ9.n289tau-BROIUnCvR_RMgh5_W0KYAkVhMZRbZcvnoXDyL7NdIxhk8SeBRDGyQp_Ug534ErQSS7ufAi3QA35EAChgsKOAxyHNnXRIEfwkF4uMI865Qa83uzFVEoS5nLG_jtC41nBY-8YnCiaHF72RqieEVMw3LRnFOoNThAtyILPM7TkvYETEjduj_9H4J01pWYck0D47tDugVIV4L_JvApOc9TKeIcpIQ9Ep2b5TjMXdVX-PWmR6p64ALBEKUiF0tVEJ7j6qZLrFfk87JKnObUlktb3Vm9gN8KuG7DxrzlF42V74zrdQAxTH5k4nwmbx2X9kaUex5DcLbuOImtmnKw`,
        "Ced-Source-Id": 500,
        "Ced-Source-Name": "shopify",
        "Ced-Target-Id": 530,
        "Ced-Target-Name": "amazon",
      },
      body: JSON.stringify(payloadAttribute),
    })
      .then((res) => res.json())
      .then((fetchedData) => {
        console.log(fetchedData.data);
        let nextOptions = [];
        var duplicateKeys = {};
        for (let i in fetchedData.data) {
          // nextOptions = [...nextOptions, ...Object.keys(fetchedData.data[i])];
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
                  deleteHandler(e, i, selectedAttributeArray[i][0]["label"])
                }
              >
                Delete
              </Link>
              <Select options={selectedAttributeArray[i]} />
              <br />
              <TextField placeholder="shopify_attribute" />
            </Card>
          ))}
        </Card>
      )}

      {attributeOptions && (
        <Card title="Amazon attributes">
          <Select
            // label=""
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
    </div>
  );
}

export default App;
