namespace API.Utils;

public static class UploadHelper
{
    async public static Task<string> UploadImage(IFormFile file)
    {
        if (file != null)
        {
            // check extentions
            List<string> validExtensions = [".jpg", ".png", ".gif"];
            string extention = Path.GetExtension(file.FileName);
            if (!validExtensions.Contains(extention))
                throw new ArgumentException("Invalid upload extension");

            // name changing
            string newFileName = Guid.NewGuid().ToString() + extention;
            string path = Path.Combine(Directory.GetCurrentDirectory(), "UploadedImages");
            using FileStream fileStream = new FileStream(Path.Combine(path, newFileName), FileMode.Create);
            await file.CopyToAsync(fileStream);

            return newFileName;
        }

        return null;
    }

    public static FileStream GetFileStream(string fileName)
    {
        string path = Path.Combine(Directory.GetCurrentDirectory(), "UploadedImages", fileName);
        if (File.Exists(path))
        {
            FileStream fileStream = new(path, FileMode.Open, FileAccess.Read, FileShare.Read, 4096, FileOptions.Asynchronous);
            return fileStream;
        }

        return null;
    }

    public static void DeleteFile(string fileName)
    {
        string path = Path.Combine(Directory.GetCurrentDirectory(), "UploadedImages");
        if (File.Exists(path))
        {
            FileInfo fileInfo = new(Path.Combine(path, fileName));
            fileInfo.Delete();
        }
    }
}