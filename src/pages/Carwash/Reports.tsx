import React, { useContext, useEffect, useState } from "react";
import { ScrollView, Text, View, ActivityIndicator } from "react-native";
import tailwind from "tailwind-rn";
import { SHADOW_SM, WIDTH } from "../../constants";
import { DatabaseContext } from "../../contexts/DatabaseContext";
import { db } from "../../lib/firebase";
import { Appointment } from "../../types/data-types";
import { LineChart, BarChart } from "react-native-chart-kit";
import lodash from "lodash";
import { commaize, indexOfMax } from "../../lib/helpers";
import { Spacer } from "../../components";

interface DailyProp {
  sales: { labels: string[]; data: number[] };
  services: { labels: string[]; data: number[] };
}

const getDaily = (appointments: Appointment[]): DailyProp => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);

  const end = new Date();
  end.setDate(end.getDate() + 1);
  end.setHours(0, 0, 0, 0);

  const filtered: Appointment[] = [];
  const servs: any = {};

  appointments.forEach((apt) => {
    const _date = new Date(apt.appointmentDate);
    const _time = _date.getTime();
    if (_time >= start.getTime() && _time <= end.getTime()) {
      apt.date = _date;
      filtered.push(apt);
      const _type = apt.service.name;
      if (!servs[_type]) {
        servs[_type] = 1;
      } else {
        servs[_type] += 1;
      }
    }
  });

  const servsLabel = Object.keys(servs).map((key) => key);
  const servsData = Object.keys(servs).map((key) => servs[key]);

  const ranges = [10, 12, 14, 16, 18];
  const salesData = [0, 0, 0, 0, 0];

  filtered.forEach((apt) => {
    for (let i = 0; i < ranges.length; i++) {
      if (apt.date?.getHours()! <= ranges[i]) {
        salesData[i] += parseFloat(apt.totalPrice);
        break;
      }
    }
  });

  return {
    sales: {
      data: salesData,
      labels: ["8:00", "10:00", "12:00", "14:00", "16:00", "18:00"],
    },
    services: {
      data: servsData,
      labels: servsLabel,
    },
  };
};

const getWeekly = (appointments: Appointment[]): number[] => {
  const tmp = new Date();
  tmp.setHours(0, 0, 0, 0);
  const r = tmp.getDay();

  const start = new Date();
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - r);

  const end = new Date();
  end.setHours(0, 0, 0, 0);
  end.setDate(end.getDate() + (6 - r));

  const filtered: Appointment[] = [];
  appointments.forEach((apt) => {
    const _date = new Date(apt.appointmentDate);
    const _time = _date.getTime();
    if (_time >= start.getTime() && _time <= end.getTime()) {
      apt.date = _date;
      filtered.push(apt);
    }
  });

  const data = [0, 0, 0, 0, 0, 0, 0];

  filtered.forEach((apt) => {
    const _day = apt.date?.getDay()!;
    data[_day] += parseFloat(apt.totalPrice) / 1000;
  });

  return data;
};

const getMonthly = (appointments: Appointment[]): number[] => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  start.setMonth(0);

  const end = new Date();
  end.setHours(0, 0, 0, 0);
  end.setMonth(11);

  const filtered: Appointment[] = [];
  appointments.forEach((apt) => {
    const _date = new Date(apt.appointmentDate);
    const _time = _date.getTime();
    if (_time >= start.getTime() && _time <= end.getTime()) {
      apt.date = _date;
      filtered.push(apt);
    }
  });

  const data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

  filtered.forEach((apt) => {
    const _month = apt.date?.getMonth()!;
    data[_month] += parseFloat(apt.totalPrice) / 1000;
  });

  return data;
};

const Reports: React.FC = () => {
  const { user } = useContext(DatabaseContext);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [noData, setNoData] = useState(false);

  getDaily(appointments);

  useEffect(() => {
    const listener = db
      .collection("appointments")
      .where("shopID", "==", user?.uid)
      .where("status", "==", "FINISHED")
      .onSnapshot((snapshot) => {
        setLoading(() => false);
        if (snapshot.docs.length <= 0) setNoData(() => true);
        else {
          setNoData(() => false);
          setAppointments(
            snapshot.docs.map(
              (doc) => ({ id: doc.id, ...doc.data() } as Appointment)
            )
          );
        }
      });

    return listener;
  }, []);

  return loading ? (
    <ActivityIndicator style={tailwind("mt-4")} size="small" color="#000" />
  ) : noData ? (
    <Text style={tailwind("text-center mt-4")}>No Appointments</Text>
  ) : (
    <ScrollView>
      <View style={tailwind("p-4")}>
        <Text style={tailwind("text-xl font-bold text-black")}>Daily</Text>
        <Text style={tailwind("text-gray-600")}>
          Total Sales: ₱
          {commaize(lodash.sum(getDaily(appointments).sales.data))}
        </Text>
        <ReportChart
          {...{
            className: "mt-2",
            labels: getDaily(appointments).sales.labels,
            data: getDaily(appointments).sales.data,
            suffix: "",
            decimals: 2,
          }}
        />

        <Text style={tailwind("text-gray-600 mt-4 mb-2")}>
          Top Service:{" "}
          {
            getDaily(appointments).services.labels[
              indexOfMax(getDaily(appointments).services.data)
            ]
          }
        </Text>
        <BarChart
          chartConfig={{
            backgroundColor: "#ffffff",
            backgroundGradientFrom: "#ffffff",
            backgroundGradientTo: "#ffffff",
            decimalPlaces: 0, // optional, defaults to 2dp
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: "5",
              strokeWidth: "2",
              stroke: "#9CA3AF",
            },
            fillShadowGradientOpacity: 1,
            fillShadowGradient: "#059669",
          }}
          data={{
            labels: getDaily(appointments).services.labels,
            datasets: [
              {
                data: getDaily(appointments).services.data,
              },
            ],
          }}
          width={WIDTH - 32} // from react-native
          height={250}
          yAxisLabel=""
          yAxisSuffix=""
        />

        <Text style={tailwind("text-xl font-bold text-black mt-4")}>
          Weekly
        </Text>
        <Text style={tailwind("text-gray-600")}>
          Total Sales: ₱{commaize(lodash.sum(getWeekly(appointments)) * 1000)}
        </Text>
        <ReportChart
          {...{
            className: "mt-2",
            labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
            data: getWeekly(appointments),
          }}
        />

        <Text style={tailwind("text-xl font-bold text-black mt-4")}>
          Monthly
        </Text>
        <Text style={tailwind("text-gray-600")}>
          Total Sales: ₱{commaize(lodash.sum(getMonthly(appointments)) * 1000)}
        </Text>
        <ReportChart
          {...{
            className: "mt-2",
            labels: [
              "Jan",
              "Feb",
              "Mar",
              "Apr",
              "May",
              "Jun",
              "Jul",
              "Aug",
              "Sep",
              "Oct",
              "Nov",
              "Dec",
            ],
            data: getMonthly(appointments),
            decimals: 2,
            rotateX: 45,
          }}
        />
      </View>
      <Spacer />
    </ScrollView>
  );
};

interface ChartProp {
  labels: string[];
  data: number[];
  className?: string;
  decimals?: number;
  suffix?: string;
  prefix?: string;
  rotateX?: number;
}

const ReportChart: React.FC<ChartProp> = ({
  labels,
  data,
  className,
  decimals = 3,
  suffix = "k",
  prefix = "₱",
  rotateX = 0,
}) => {
  return (
    <View style={[tailwind(`rounded-md ${className}`), { ...SHADOW_SM }]}>
      <LineChart
        data={{
          labels,
          datasets: [
            {
              data,
            },
          ],
        }}
        width={WIDTH - 32} // from react-native
        height={250}
        yAxisLabel={prefix}
        yAxisSuffix={suffix}
        yAxisInterval={1} // optional, defaults to 1
        verticalLabelRotation={rotateX}
        chartConfig={{
          backgroundColor: "#ffffff",
          backgroundGradientFrom: "#ffffff",
          backgroundGradientTo: "#ffffff",
          decimalPlaces: decimals, // optional, defaults to 2dp
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: "5",
            strokeWidth: "2",
            stroke: "#9CA3AF",
          },
          fillShadowGradient: "#ffffff",
        }}
        bezier
        style={{ borderRadius: 6 }}
      />
    </View>
  );
};

export default Reports;
