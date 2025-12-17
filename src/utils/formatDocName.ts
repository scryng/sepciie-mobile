const formatDocName = (docName: string) => {
  if (docName.includes('CRLV')) return 'CRLV';
  if (docName.includes('CIV')) return 'CIV';
  if (docName.includes('CIPP')) return 'CIPP';
  if (docName.length > 40) return docName.substring(0, 37) + '...';
  return docName;
};

export default formatDocName;
