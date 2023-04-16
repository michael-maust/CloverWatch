import {useQuery} from "@tanstack/react-query";
import {
  Session,
  useSession,
  useSupabaseClient,
  useUser,
} from "@supabase/auth-helpers-react";
import {useCallback, useEffect, useState} from "react";

export const useProfile = () => {
  const supabase = useSupabaseClient();
  const session = useSession();
  const user = useUser();

  const [loading, setLoading] = useState(true);
  const [fullName, setFullName] = useState<string | null>(null);
  const [zipcode, setZipcode] = useState<string | null>(null);
  const [farmName, setFarmName] = useState<string | null>(null);

  useEffect(() => {
    getProfile();
  }, [session]);

  async function getProfile() {
    try {
      setLoading(true);

      let {data, error, status} = await supabase
        .from("profiles")
        .select(`full_name, zipcode, farm_name`)
        .eq("id", user?.id)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setFullName(data.full_name);
        setZipcode(data.zipcode);
        setFarmName(data.farm_name);
      }
    } catch (error) {
      alert("Error loading user data!");
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  type UpdateProfileT = {
    fullName: string | null;
    zipcode: string | null;
    farmName: string | null;
  };

  const updateProfile = useCallback(
    async ({fullName, zipcode, farmName}: UpdateProfileT) => {
      try {
        setLoading(true);

        const updates = {
          id: user?.id,
          full_name: fullName,
          zipcode,
          farm_name: farmName,
          updated_at: new Date().toISOString(),
        };

        let {error} = await supabase.from("profiles").upsert(updates);
        if (error) throw error;
        alert("Profile updated!");
      } catch (error) {
        alert("Error updating the data!");
        console.log(error);
      } finally {
        setLoading(false);
      }
    },
    [user?.id]
  );

  return {
    loading,
    fullName,
    zipcode,
    farmName,
    profileId: user?.id,
    updateProfile,
  };
};
